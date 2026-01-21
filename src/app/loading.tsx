import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Header skeleton */}
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>

                {/* Card skeleton */}
                <Skeleton className="h-32 w-full" />

                {/* Button skeleton */}
                <div className="flex gap-3">
                    <Skeleton className="h-12 w-28" />
                    <Skeleton className="h-12 w-28" />
                </div>
            </div>
        </div>
    )
}
