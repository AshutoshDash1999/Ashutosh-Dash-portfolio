import axios, { AxiosError } from "axios";
import type {
    PostHogErrorResponse,
    PostHogQueryPayload,
    PostHogQueryResult,
} from "./types";

const POSTHOG_API_HOST = "https://us.posthog.com";

// Rate limiting configuration
const MAX_CONCURRENT_QUERIES = 2; // PostHog limit is 3, we use 2 for safety buffer
const RETRY_DELAY_MS = 1000;
const MAX_RETRIES = 3;

/**
 * Simple semaphore for limiting concurrent PostHog queries
 */
class QuerySemaphore {
    private running = 0;
    private queue: Array<() => void> = [];

    async acquire(): Promise<void> {
        if (this.running < MAX_CONCURRENT_QUERIES) {
            this.running++;
            return;
        }

        return new Promise<void>((resolve) => {
            this.queue.push(() => {
                this.running++;
                resolve();
            });
        });
    }

    release(): void {
        this.running--;
        const next = this.queue.shift();
        if (next) {
            next();
        }
    }
}

// Global semaphore instance for rate limiting
const semaphore = new QuerySemaphore();

/**
 * Custom error class for PostHog query errors
 */
export class PostHogQueryError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "PostHogQueryError";
        this.statusCode = statusCode;
    }
}

/**
 * Get PostHog configuration from environment variables
 */
function getPostHogConfig() {
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;

    if (!apiKey) {
        throw new Error(
            "POSTHOG_PERSONAL_API_KEY environment variable is not set"
        );
    }

    if (!projectId) {
        throw new Error("POSTHOG_PROJECT_ID environment variable is not set");
    }

    return { apiKey, projectId };
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a HogQL query against PostHog with rate limiting and retry logic
 */
export async function queryPostHog<T = unknown[][]>(
    hogqlQuery: string
): Promise<PostHogQueryResult<T>> {
    const { apiKey, projectId } = getPostHogConfig();

    const payload: PostHogQueryPayload = {
        query: {
            kind: "HogQLQuery",
            query: hogqlQuery,
        },
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        await semaphore.acquire();

        try {
            const { data } = await axios.post<PostHogQueryResult<T>>(
                `${POSTHOG_API_HOST}/api/projects/${projectId}/query/`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                    timeout: 30000, // 30 second timeout
                }
            );

            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const statusCode = error.response?.status ?? 500;
                const errorData = error.response?.data as
                    | PostHogErrorResponse
                    | undefined;
                const errorMessage =
                    errorData?.detail ||
                    `PostHog API error: ${error.response?.status}`;

                // Retry on rate limit (429) or server errors (5xx)
                if (statusCode === 429 || statusCode >= 500) {
                    lastError = new PostHogQueryError(errorMessage, statusCode);

                    // Wait before retrying with exponential backoff
                    if (attempt < MAX_RETRIES - 1) {
                        const backoffMs =
                            RETRY_DELAY_MS * Math.pow(2, attempt);
                        await sleep(backoffMs);
                        continue;
                    }
                }

                throw new PostHogQueryError(errorMessage, statusCode);
            }
            throw error;
        } finally {
            semaphore.release();
        }
    }

    // If we've exhausted all retries, throw the last error
    if (lastError) {
        throw lastError;
    }

    throw new Error("Unexpected error in queryPostHog");
}
