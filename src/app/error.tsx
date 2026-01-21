'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'
import posthog from 'posthog-js'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Track error in PostHog
        posthog.capture('$exception', {
            $exception_message: error.message,
            $exception_type: error.name,
            $exception_stack: error.stack,
            digest: error.digest,
        })
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <Alert variant="destructive">
                    <IconAlertTriangle className="size-5" />
                    <AlertTitle className="text-lg">Something went wrong!</AlertTitle>
                    <AlertDescription>
                        <p className="mb-4">
                            Don&apos;t worry, it happens to the best of us. Let&apos;s try that again.
                        </p>
                        {error.digest && (
                            <p className="text-xs font-mono opacity-70 mb-4">
                                Error ID: {error.digest}
                            </p>
                        )}
                        <Button
                            onClick={() => reset()}
                            variant="neutral"
                            size="sm"
                        >
                            <IconRefresh className="size-4" />
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
