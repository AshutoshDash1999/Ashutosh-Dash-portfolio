import { usePostHog } from 'posthog-js/react'

export function useTrackEvent() {
  const posthog = usePostHog()

  const trackEvent = (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    if (!posthog) return
    
    posthog.capture(eventName, properties)
  }

  return { trackEvent }
}