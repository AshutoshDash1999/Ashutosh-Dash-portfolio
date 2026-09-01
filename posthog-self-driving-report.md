# PostHog Self-driving Setup Report

**Project:** Ashutosh Dash Portfolio (`ashutoshdash.in`)
**Date:** 2026-08-28
**Inbox:** https://us.posthog.com/project/294670/inbox

## Summary

PostHog Self-driving has been configured for this portfolio site. Session Replay, Error Tracking, and Support (Conversations) products were enabled; six native signal sources and one custom scout were wired up; and two Replay Vision scanners are now armed and scanning session recordings. Findings will start appearing in the [Self-driving inbox](https://us.posthog.com/project/294670/inbox) within approximately 30 minutes.

---

## AI data processing

**Approved.** Organization-level AI data processing consent was granted before this run.

---

## GitHub

**Connected during this run.** GitHub App installed for account `AshutoshDash1999` (integration id: 258068). Self-driving can now research findings in the repo and open draft PRs.

---

## Products enabled

| Product | Status | Notes |
|---|---|---|
| Session Replay | **already enabled** | Recordings are actively arriving. |
| Error Tracking | **enabled** | No exceptions yet — source is armed. |
| Support (Conversations) | **enabled** | Tickets arrive once an inbound channel is connected (see Follow-ups). |

The `posthog.init` call in `src/instrumentation-client.ts` has no `disable_session_recording` or `capture_exceptions` overrides — server-side enables take effect immediately.

---

## Signal sources

| source_product | source_type | Action | Config ID |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | **on by default** (no row needed) | — |
| `health_checks` | `health_issue` | **created, enabled** | `01a04984-a256-7fb9-8dae-6a467ec999b7` |
| `error_tracking` | `issue_created` | **created, enabled** | `01a04984-a4a5-7819-9883-41a75be97386` |
| `error_tracking` | `issue_reopened` | **created, enabled** | `01a04984-a99e-7d0b-8b7d-44cd6e819ad2` |
| `error_tracking` | `issue_spiking` | **created, enabled** | `01a04984-ac5c-7249-b2bf-2af0f1ca2415` |
| `session_replay` | `session_analysis_cluster` | **created, enabled** (sample rate: 10%) | `01a04984-b191-7fdf-b657-75d2316fc8fd` |
| `conversations` | `ticket` | **created, enabled** (dormant until a channel is connected) | `01a04984-b45c-753b-a362-429e8cb78040` |
| `llm_analytics` | — | **skipped** — internal-only, not a user-facing responder |
| `logs` | — | **skipped** — not a v1 responder |
| `replay_vision` | — | **skipped** — self-authorized via scanner `emits_signals` flag (step 6c) |

---

## Connected tools

No external issue tracker, support desk, or connected tool was selected. All external connectors are skipped (not used).

---

## Scout troop

**Run budget:** 100 runs/day (early access default; 0 used today).
**Banner:** "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."

### Enabled (6 scouts)

| Scout | Reason enabled |
|---|---|
| `general` | Always on — cross-product correlations and surfaces no specialist covers |
| `web-analytics` | Primary surface — heavy traffic, audience, and campaign source tracking via PostHog API |
| `web-vitals` | Project explicitly captures `$web_vitals` via `src/components/web-vitals.ts` |
| `product-analytics` | Portfolio interaction events tracked (`nav_link_click`, `project_code_click`, etc.) |
| `anomaly-detection` | Cross-product — catches unexpected drops/spikes in any time series |
| `portfolio-resume-conversion` | Custom scout — watches resume click rate vs pageviews (see Custom scouts below) |

### Disabled (22 scouts)

| Scout | Reason |
|---|---|
| `error-tracking` | **Covered by native source** — error tracking source enabled in step 4 |
| `session-replay` | **Covered by native source** — session replay source enabled in step 4 |
| `ai-observability` | No `$ai_*` events or LLM usage found |
| `feature-flags` | No feature flags in this codebase |
| `experiments` | No A/B experiments in use |
| `surveys` | No surveys configured |
| `revenue-analytics` | No payment SDK or revenue events |
| `logs` | PostHog logs product not in use |
| `csp-violations` | No CSP reporting configured |
| `customer-analytics` | No group/accounts analytics — personal portfolio |
| `data-pipelines` | No CDP destinations or exports configured |
| `data-warehouse` | No warehouse sources connected |
| `apm` | No distributed tracing / OpenTelemetry |
| `conversations` | No `$conversation_*` events yet (Conversations product just enabled) |
| `health-checks` | No health issues present yet |
| `observability-gaps` | Not enabled — room reserved for future use |
| `anomaly-detection` | (enabled — see above) |
| `inbox-validation` | Fresh setup — no resolved reports to validate yet |
| `insight-alerts` | No configured insight alerts |
| `replay-vision` | Scanner step (6c) is the data layer — this scout reads trends across observations; deferred until scanner observations accumulate |
| `mcp-tool-calls` | No `$mcp_tool_call` telemetry |
| `skills-store` | Not needed for this project |
| `tasks` | No PostHog Tasks in use |

To re-enable a disabled scout later, go to the [inbox](https://us.posthog.com/project/294670/inbox) and enable it from the scout configuration page.

---

## Custom scouts

### Created: `signals-scout-portfolio-resume-conversion`

- **Skill ID:** `01a04990-5b3d-71d8-914f-ee1a66f66856`
- **Config ID:** `01a04990-796b-7a84-98ca-a57a2a384d34`
- **Surface:** Resume CTA engagement rate — `resume_button_click` + `context_menu_resume_click` events vs `$pageview` count
- **Discriminator:** Ratio of resume intent events to pageviews over a 7-day trailing window vs the prior window. Speaks up when the ratio drops >30% while pageviews hold within 20% — meaning the CTA is broken, buried, or not rendering. A proportional traffic drop is ruled out as a quality/seasonal shift.
- **Why no built-in scout covers it:** `web-analytics` watches raw traffic and attribution; `product-analytics` watches saved funnels (no resume funnel exists in PostHog). This specific conversion signal — resume intent per visitor — has no built-in coverage.
- **Explore patterns:** 7-day window comparison SQL, device/browser breakdown on drop, referrer-type split to confirm it's a site issue not a traffic mix shift.
- **Noise escape hatch:** If the scout turns out noisy, set `emit: false` on its config in the PostHog inbox to switch it to dry-run.

### Surfaces considered but ruled out

| Surface | Filter that eliminated it |
|---|---|
| Game/puzzle completion rate | Weak discriminator — no clear failure state; error tracking and session replay already catch bugs |
| Project/social outbound click drops | Informational only — no clear defect signal or urgency |
| Client work / open source section drops | Same as above |

---

## Replay Vision scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find straight into the Self-driving inbox. Findings arrive at half weight, so a report is promoted only when two independent findings corroborate it. This project already has recordings (confirmed during setup), so both scanners start working immediately.

**Note:** The `creating-replay-vision-scanners` in-product skill returned 404 on this deploy, so monthly credit spend was not verified against the org quota API. The briefs are small by design; the breakage monitor projects 225 credits/month (45 estimated observations × 5 credits each), and the frustration monitor projects 0 credits (no rage clicks currently).

| Scanner | ID | Type | Query scope | Sampling rate | Est. monthly credits |
|---|---|---|---|---|---|
| Portfolio home breakage | `01a04992-63de-7202-838b-de04dfe6c4bd` | monitor | Sessions on `ashutoshdash.in` (all pages) | 50% | 225 |
| Portfolio visitor frustration | `01a04992-719b-7569-8a1d-eedcf57d672b` | monitor | Sessions with `$rageclick` events | 100% | 0 (no rage clicks yet) |

**Portfolio home breakage** watches sessions on any page of the site for visible product failures: blank hero section, unresponsive interactive games (slide puzzle, card game), portfolio cards failing to load, navigation links not scrolling, or the resume download returning an error.

**Portfolio visitor frustration** watches rage-click sessions for visitor struggle: hammering the resume button, repeatedly clicking non-responsive navigation links, repeatedly clicking project or social links that don't navigate, or the interactive sections not responding to input. It activates the moment the first rage click is recorded.

The scanners are self-authorizing — `emits_signals: true` means no separate `SignalSourceConfig` row is needed.

---

## Follow-ups

- [ ] **Connect a Support inbound channel** so the Conversations source produces tickets: go to PostHog → Support → connect email, inbox, or Slack. The responder is already enabled and will pick up tickets automatically once a channel exists.
- [ ] **Verify Replay Vision quota** once the `creating-replay-vision-scanners` skill becomes available on this deploy. Monthly estimated spend is ~225 credits for the breakage monitor; verify this is within your org's budget.
- [ ] **Save a resume funnel insight in PostHog** (e.g. `$pageview` → `resume_button_click`) so the `product-analytics` scout has saved flows to watch — right now it has no funnels and will close out empty each run.
- [ ] **Re-enable `signals-scout-replay-vision`** once the two Replay Vision scanners have accumulated a few weeks of observations — that scout reads trends *across* observations and needs data to be useful.
- [ ] **Re-enable `signals-scout-feature-flags`** if you add PostHog feature flags to the codebase.
- [ ] **Re-enable `signals-scout-experiments`** if you set up A/B tests.

---

## What happens next

- The scout coordinator picks up fresh configs within ~30 minutes; fresh scouts fire on the next coordinator tick.
- Scout runs draw from the project's daily budget (100 runs/day during early access). With 6 scouts enabled, that's well within the limit.
- Replay Vision scanners sweep matching recordings every 5 minutes.
- Findings cluster into reports in the inbox; immediately-actionable ones can start coding tasks automatically.
- Check your inbox at: https://us.posthog.com/project/294670/inbox
