import axios, { AxiosError } from "axios";
import type {
    PostHogErrorResponse,
    PostHogQueryPayload,
    PostHogQueryResult,
} from "./types";

const POSTHOG_API_HOST = "https://us.posthog.com";

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
    throw new Error("POSTHOG_PERSONAL_API_KEY environment variable is not set");
  }

  if (!projectId) {
    throw new Error("POSTHOG_PROJECT_ID environment variable is not set");
  }

  return { apiKey, projectId };
}

/**
 * Execute a HogQL query against PostHog
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

  try {
    const { data } = await axios.post<PostHogQueryResult<T>>(
      `${POSTHOG_API_HOST}/api/projects/${projectId}/query/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as PostHogErrorResponse | undefined;
      const errorMessage = errorData?.detail || `PostHog API error: ${error.response?.status}`;
      throw new PostHogQueryError(errorMessage, error.response?.status ?? 500);
    }
    throw error;
  }
}
