
'use client'

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="max-w-md text-center">
                <h1 className="text-3xl font-bold text-destructive mb-4">Something went wrong!</h1>
                <p className="text-muted-foreground mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                
                {error?.message && (
                    <details className="text-left bg-muted p-4 rounded-lg mb-6">
                        <summary className="cursor-pointer font-medium">Error Details</summary>
                        <pre className="mt-2 text-xs whitespace-pre-wrap break-all">
                          <code>{error.message}</code>
                        </pre>
                    </details>
                )}

                <Button onClick={() => reset()}>
                    Try again
                </Button>
            </div>
        </div>
      </body>
    </html>
  )
}
