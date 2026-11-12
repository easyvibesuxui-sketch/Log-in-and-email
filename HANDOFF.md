# SAM / RAM — Auth & Onboarding Handoff

Updated: 2026-10-29

## Live prototypes (Netlify)

| Page | URL | Source file |
|---|---|---|
| SAM login + onboarding flow | https://sam-login-cd-e627cbe96f.netlify.app | `SAM Login Deploy.dc.html` |
| SAM invitation email | https://sam-invitation-email-cd-de28f29f59.netlify.app | `SAM Email Deploy.dc.html` |
| RAM login + onboarding flow | https://ram-login-cd-6643e01dd4.netlify.app | `RAM Login Deploy.dc.html` (wraps SAM Login Deploy, `brand="RAM"`) |
| RAM invitation email | https://ram-invitation-email-cd-f1b4e9ab68.netlify.app | `RAM Email Deploy.dc.html` |

The SAM and RAM flows run on the same component. The `brand` prop (`"SAM"` default, `"RAM"`) only changes branding and copy.

## Deep links (URL hash)

You can open any step directly by adding a hash to the flow URL, e.g. `…netlify.app/#reset`.

| Hash | Screen | Design file |
|---|---|---|
| `#login` | Sign in | `SAM 01 Login` |
| `#recovery` | Forgot password (enter email) | `SAM 02 Forgot password` |
| `#code` | Enter 6-digit code | `SAM 03 Enter code` |
| `#reset` | Set new password | `SAM 04 New password` |
| `#done` | Password updated | `SAM 05 Password updated` |
| `#welcome` | Invitation landing / activate account | `SAM 06 Welcome` |
| `#onboarding` | Onboarding wizard (5 steps) | — |
| `#complete` | Setup complete | `SAM 12 Setup complete` |
| `#invalid` | Invitation link broken / expired | `SAM 14 Link broken`, `RAM 14 Link broken` |

`SAM 13 Activation link used` is the login screen with `linkUsed=true`, which shows a notice that the activation link has already been used.

`SAM Architecture.dc.html` maps all of the screens and links between them.

## Flows

1. **Invitation:** Email CTA → `#welcome` → set password → `#onboarding` (steps 1–5) → `#complete`
2. **Password recovery:** `#login` → `#recovery` → `#code` → `#reset` → `#done` → `#login`
3. **Link edge cases:** the link has already been used → login with notice; the link is broken or expired → `#invalid`

Where the email CTA points, by `linkState`:
- `valid` → `#welcome`
- `used` → `#login`
- `broken` → `#invalid`

## Validation rules in the prototype

- **Recovery email:** basic `name@domain.tld` pattern. The button stays disabled until the email is valid.
- **Code:** 6 inputs, digits only, one per field. Continue is enabled once all 6 are filled.
- **Resend code:** 30-second cooldown with a countdown, and the inputs are cleared.
- **New password:** at least 8 characters, 1 digit and 1 uppercase letter. The confirmation field must match, otherwise a mismatch error shows.
- **Login error state:** toggled with the `errorState` prop.

## Component props (`SAM Login Deploy`)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `startStep` | enum | `welcome` | One of the hash values above. The URL hash overrides it. |
| `startOb` | int 1–5 | 1 | Starting onboarding sub-step |
| `errorState` | boolean | — | Shows the login error |
| `linkUsed` | boolean | false | Shows the "activation link already used" notice |
| `brand` | `SAM` \| `RAM` | `SAM` | Branding |
| `firstName`, `workEmail` | text | — | Prefill values for onboarding |

Invitation email props: `linkState` (`valid`/`used`/`broken`), `expiryDays` (default 7), `showAccessList`, `showLanguageNote`.

## Onboarding defaults

- **Locale:** Germany · Europe / Berlin · EUR · English · DD.MM.YYYY · Metric · week starts Monday
- **Security:** 2FA on by default; session timeout 1 hour
- **Notifications:** delivery "Both", "Daily digest"
- **Toggles on:** pin, device, faults, maint, shift
- **Toggles off:** util, product

## Visual tokens

- **Fonts:** ABC Favorit Expanded (`FavoritExp`) for headlines, ABC Favorit Extended (`FavoritExt`) for UI, with Helvetica as fallback. These are licensed Dinamo fonts and are currently inlined in the prototype, so production needs a proper web license.
- **Background:** `#1a1a1a` / `#141414`
- **Accent / primary:** `#ff1e00` (hover `#e01a00`)
- **Disabled button:** `#bcbcbc`
- **Text:** `#ffffff`, secondary `#9a9a9a` / `#cfcfcf`
- **Warning:** `#f2a01e` · **Success:** `#71C562` · **Error:** `#dd0000`
- **Primary button:** 320px max width, 15px vertical padding, 14px bold, no radius
- **Inputs:** floating labels (13px → 10px on focus or when filled), 130ms transition
- **Toggles:** 44×24 pill, accent fill when on
- **Email:** light ground `#ffffff` / `#f4f2ef`, divider `#e2e0dc`, muted text `#8b8781`

## Notes for engineering

- The prototype uses inline styles and local state only. There is no backend: codes, passwords and invites are not checked.
- The email is a design mock. It needs rebuilding as table-based HTML for email clients, and the CTA URLs must be replaced with real signed activation links.
- Visuals (the 3D excavator scene and globe background) come from `excavator-scene.js` and `globe-bg.js`.
