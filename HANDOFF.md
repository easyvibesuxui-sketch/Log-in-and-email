# SAM / RAM — Auth & Activation Handoff

Updated: 2026-11-13

## Live prototypes (Netlify)

| Page | URL | Source file |
|---|---|---|
| SAM login + activation flow | https://sam-login-cd-e627cbe96f.netlify.app | `SAM Login Deploy.dc.html` |
| SAM invitation email | https://sam-invitation-email-cd-de28f29f59.netlify.app | `SAM Email Deploy.dc.html` |
| RAM login + activation flow | https://ram-login-cd-6643e01dd4.netlify.app | `RAM Login Deploy.dc.html` (wraps SAM Login Deploy, `brand="RAM"`) |
| RAM invitation email | https://ram-invitation-email-cd-f1b4e9ab68.netlify.app | `RAM Email Deploy.dc.html` |

These Netlify sites were deployed before the November changes (Google / Microsoft sign-in, the removed onboarding, the account-not-added error, mobile layout). Redeploy them to see the current design.

The SAM and RAM flows run on the same component. The `brand` prop (`"SAM"` default, `"RAM"`) only changes branding and copy, including every product name in the flow ("Join RAM", "Enter RAM", the error messages).

## Deep links (URL hash)

You can open any step directly by adding a hash to the flow URL, e.g. `…netlify.app/#reset`.

| Hash | Screen | Design file |
|---|---|---|
| `#login` | Sign in (e-mail and password, or Google / Microsoft) | `SAM 01 Login` |
| `#recovery` | Forgot password (enter email) | `SAM 02 Forgot password` |
| `#code` | Enter 6-digit code | `SAM 03 Enter code` |
| `#reset` | Set new password | `SAM 04 New password` |
| `#done` | Password updated | `SAM 05 Password updated` |
| `#welcome` | Invitation landing: set a password or join with Google / Microsoft | `SAM 06 Welcome` |
| `#complete` | Account activated | `SAM 12 Setup complete` |
| `#invalid` | Invitation link broken / expired | `SAM 14 Link broken`, `RAM 14 Link broken` |

`SAM 13 Activation link used` is the login screen with `linkUsed=true`, which shows a notice that the activation link has already been used.

`SAM Architecture.dc.html` maps all of the screens and links between them.

## Flows

1. **Invitation:** Email CTA → `#welcome` → set a password **or** join with Google / Microsoft → `#complete` → Enter SAM
2. **Password recovery:** `#login` → `#recovery` → `#code` → `#reset` → `#done` → `#login`
3. **Link edge cases:** the link has already been used → login with notice; the link is broken or expired → `#invalid`
4. **Single sign-on:** `#login` offers "Sign in with Google" and "Sign in with Microsoft" under the Sign in button. Production needs real Google OAuth and Microsoft Entra ID sign-in, and should only accept an account an administrator has added.
5. **Account not added by an administrator:** signing in with an e-mail, Google account or Microsoft account that no administrator has added shows an error and does not sign in. The e-mail error sits under the e-mail field; the Google / Microsoft error sits under those buttons. Both tell the person to ask their administrator for an invitation.

The onboarding wizard (5 steps) has been removed: an activated account goes straight to `#complete`.

Where the email CTA points, by `linkState`:
- `valid` → `#welcome`
- `used` → `#login`
- `broken` → `#invalid`

## Validation rules in the prototype

- **Login e-mail:** the prototype knows one account, `workEmail` (default `a.keller@syniotec.com`, any letter case). Sign in with any other e-mail shows the "not added by an administrator" error; editing the e-mail clears it.
- **Google / Microsoft on login:** sign in by default; with `ssoError` on, they show the "not added by an administrator" error for that provider.
- **Recovery email:** basic `name@domain.tld` pattern. The button stays disabled until the email is valid.
- **Code:** 6 inputs, digits only, one per field. Continue is enabled once all 6 are filled.
- **Resend code:** 30-second cooldown with a countdown, and the inputs are cleared.
- **New password:** at least 8 characters, 1 digit and 1 uppercase letter. The confirmation field must match, otherwise a mismatch error shows.

## Component props (`SAM Login Deploy`)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `startStep` | enum | `welcome` | One of the hash values above. The URL hash overrides it. |
| `errorState` | boolean | false | Shows the e-mail "not added by an administrator" error |
| `ssoError` | boolean | false | Google / Microsoft sign-in shows the "not added by an administrator" error |
| `linkUsed` | boolean | false | Shows the "activation link already used" notice |
| `brand` | `SAM` \| `RAM` | `SAM` | Branding |
| `firstName`, `workEmail` | text | `Anna`, `a.keller@syniotec.com` | Name and invited e-mail on the activation screen; `workEmail` is also the account the login accepts |

Invitation email props: `linkState` (`valid`/`used`/`broken`), `expiryDays` (default 7), `showAccessList`, `showLanguageNote`.

## Visual tokens

- **Fonts:** ABC Favorit Expanded (`FavoritExp`) for headlines, ABC Favorit Extended (`FavoritExt`) for UI, with Helvetica as fallback. These are licensed Dinamo fonts and are currently inlined in the prototype, so production needs a proper web license.
- **Background:** `#1a1a1a` / `#141414`
- **Accent / primary:** `#ff1e00` (hover `#e01a00`)
- **Disabled button:** `#bcbcbc` background, `#4a4a4a` text (4.7:1)
- **Text:** `#ffffff`, secondary `#9a9a9a` / `#cfcfcf`
- **Warning:** `#f2a01e` (inline errors) · **Success:** `#71C562` · **Error:** `#dd0000`
- **Primary button:** 320px max width, 15px vertical padding, 14px bold, no radius
- **Inputs:** floating labels (13px → 10px on focus or when filled), 130ms transition
- **SSO buttons:** transparent, 1px `rgba(255,255,255,0.4)` border, 48px tall, two across in 320px; they wrap to one per row when narrow
- **Email:** light ground `#ffffff` / `#f4f2ef`, divider `#e2e0dc`, muted text `#8b8781`

## Responsive behaviour

- **Auth screens (≤ 960px):** the photo panel is hidden and the form takes the full width with 20px side padding; the 6 code fields share the row.
- **Account activated:** the card fills the width on a phone.
- Checked at 375px and 1280px: no horizontal scrolling on any step.

## Notes for engineering

- The prototype uses inline styles and local state only. There is no backend: codes, passwords, invites and accounts are not really checked.
- The email is a design mock. It needs rebuilding as table-based HTML for email clients, and the CTA URLs must be replaced with real signed activation links.
- Visuals (the 3D excavator scene and globe background) come from `excavator-scene.js` and `globe-bg.js`.
- Removed in November: the 5-step onboarding wizard, and the old separate copies `SAM Login.dc.html` and `SAM-Login-standalone.html`.
