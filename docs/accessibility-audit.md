# Accessibility audit

## Automated baseline

The authenticated Playwright journey runs Axe with the `wcag2a`, `wcag2aa` and
`wcag22aa` tags. The following screens currently pass with zero detected
violations:

- login;
- Control Room;
- new Signal form;
- Signal Feed after creation.

The audit runs against the real Next.js, Rails and Supabase local stack rather
than static component fixtures.

## Manual checks remaining

- complete every primary journey with a keyboard only;
- verify focus order and focus restoration in custom selects and dialogs;
- inspect landing, signup, onboarding, members, settings and public form;
- verify 200% browser zoom without overlap or lost controls;
- verify 390, 768, 1440 and 1728 pixel layouts;
- verify `prefers-reduced-motion` on landing and application transitions;
- confirm labels, announcements and error recovery with VoiceOver;
- confirm text and non-text contrast in every state.

Automated results are a regression baseline, not a substitute for this manual
audit.
