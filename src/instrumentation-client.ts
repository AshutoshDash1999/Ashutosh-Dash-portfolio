import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ph',
    ui_host: 'https://us.posthog.com',
    defaults: '2025-11-30',
    capture_pageview: true,
    capture_pageleave: true,
    capture_dead_clicks: true,
    person_profiles:"never"
})