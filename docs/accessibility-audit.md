# Accessibility audit

## Automated baseline

The Playwright journeys run Axe with the `wcag2a`, `wcag2aa` and `wcag22aa`
tags. The following screens currently pass with zero detected violations:

- login;
- signup;
- onboarding;
- Control Room;
- new Signal form;
- Signal Feed after creation.
- members;
- settings;
- public Signal form;
- invitation entry.

The audit runs against the real Next.js, Rails and Supabase local stack rather
than static component fixtures.

The suite also verifies:

- no horizontal overflow at 390, 720, 768, 1440 and 1728 pixels;
- the 720 pixel reflow equivalent of a 1440 pixel viewport at 200% zoom;
- visible skip links and focus transfer to primary content;
- roving focus, arrow keys, Home/End, Escape and Tab behavior in custom selects;
- reduced-motion overrides for the animated hero;
- focus transfer and programmatic error descriptions on the public form.

## Manual checks remaining

- complete every primary journey with a keyboard only beyond the covered skip
  links and custom selects;
- verify actual 200% browser zoom in Chrome and Safari, beyond the automated
  equivalent-width reflow check;
- confirm labels, announcements and error recovery with VoiceOver;
- confirm text and non-text contrast in hover, focus, disabled and error states.

Automated results are a regression baseline, not a substitute for this manual
audit.
