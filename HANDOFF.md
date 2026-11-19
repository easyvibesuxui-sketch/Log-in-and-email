# SAM / RAM — Auth & Activation Handoff

Updated: 2026-11-13

## Live prototypes (Netlify)

| Page | URL | Source file |
|---|---|---|
| SAM login + activation flow | https://sam-login-cd-e627cbe96f.netlify.app | `SAM Login Deploy.dc.html` |
| SAM invitation email | https://sam-invitation-email-cd-de28f29f59.netlify.app | `SAM Email Deploy.dc.html` |
| RAM login + activation flow | https://ram-login-cd-6643e01dd4.netlify.app | `RAM Login Deploy.dc.html` (wraps SAM Login Deploy, `brand="RAM"`) |
| RAM invitation email | https://ram-invitation-email-cd-f1b4e9ab68.netlify.app | `RAM Email Deploy.dc.html` |
| SAM daily digest e-mail (24 h) | https://sam-daily-digest-email.netlify.app | `SAM Daily Digest Email.dc.html` (the sample PDFs are served from `/downloads/`) |

Both login sites were redeployed on 2026-11-13 with the current design (Google / Microsoft sign-in, no onboarding, the account-not-added error, mobile layout). Each site serves its page as `index.html` next to `support.js`, `image-slot.js` and `excavator-scene.js`; the RAM site also carries `SAM Login Deploy.dc.html`. The two invitation-email sites were redeployed the same day: their text now says the account can be activated with a password or with a Google or Microsoft account.

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
| `#invalid` | Invitation link broken / expired | `SAM 14 Link broken`, `RAM 14 Link broken` |
| `#used` | Login with the "activation link already used" notice | `SAM 13 Activation link used` |
| `#not-invited` | Login: e-mail not added by an administrator (example `k.wagner@example.com`) | `SAM 15 Not invited e-mail` |
| `#not-invited-google` | Login: Google account not added by an administrator | `SAM 16 Not invited Google` |
| `#not-invited-microsoft` | Login: Microsoft account not added by an administrator | `SAM 17 Not invited Microsoft` |

`SAM 13 Activation link used` is the login screen with `linkUsed=true`, which shows a notice that the activation link has already been used. On the flow URL it opens with `#used`.

`SAM Architecture.dc.html` maps all of the screens and links between them. Every SAM screen page (`SAM 01`–`SAM 17`) has a RAM twin (`RAM 01`–`RAM 17`, `brand="RAM"`). In the canvas Pages menu the pages are grouped SAM first, then RAM, each with Login pages before E-mails, then the docs.

## Flows

1. **Invitation:** Email CTA → `#welcome` → set a password **or** join with Google / Microsoft → `#login`, with an "Your account is activated. Sign in to continue." notice and the invited e-mail filled in
2. **Password recovery:** `#login` → `#recovery` → `#code` → `#reset` → `#done` → `#login`
3. **Link edge cases:** the link has already been used → login with notice; the link is broken or expired → `#invalid`
4. **Single sign-on:** `#login` offers "Sign in with Google" and "Sign in with Microsoft" under the Sign in button. Production needs real Google OAuth and Microsoft Entra ID sign-in, and should only accept an account an administrator has added.
5. **Account not added by an administrator:** signing in with an e-mail, Google account or Microsoft account that no administrator has added shows an error and does not sign in. The e-mail error sits under the e-mail field; the Google / Microsoft error sits under those buttons. Both tell the person to ask their administrator for an invitation.

There is no onboarding: the 5-step wizard and its "Setup complete" / "Account activated" end screen have been removed. Activation ends on the login screen.

Where the email CTA points, by `linkState`:
- `valid` → `#welcome`
- `used` → `#login`
- `broken` → `#invalid`

## Daily digest e-mail

`SAM Daily Digest Email.dc.html` is the design for the digest sent to the responsible person, further responsible persons and dispatcher of a project when resources were planned for it.

- **Schedule:** Monday to Friday at 07:00 Europe/Berlin, covering the previous 24 hours. No mails on Saturday and Sunday; Monday's mail covers Friday, Saturday and Sunday (`period` prop: `weekday` | `monday`).
- **Order:** projects → requests, direct bookings (booked without a request), bookings (resources assigned to a request) → within each group by resource type (Equipment, Person, Crew, Truck transport), then creation order. E-mail and PDF use the same grouping.
- **Content:** period, three totals at the top (requests, direct bookings, bookings), a summary with those three counts per project (`showSummary`; on phones each project name gets its own line), then one card per project (black header with cost center, title, counts and "Open project in SAM") holding a Requests, a Direct bookings and a Bookings group; each item shows its resource type, title and the fields from the specification. Person qualifications show 1, 2 or 3 levels as a path (`Electrician › High voltage`).
- **Links:** project names (summary and section header) and the black "Open project in SAM" button open the project; every item card is a link to that plan ("View in SAM ›"); the main button downloads the digest as PDF. In the summary, project rows are light grey and the Total row is dark.
- **PDF:** "Download as PDF" opens an A4 PDF of the same digest (`variant` prop: `email` | `pdf`; canvas page `SAM Daily Digest PDF`). It has the header, the four totals (requests, direct bookings, bookings, projects), the summary, then one card per project with the three groups as tables (Resource / Item / Details / Created) and a "View in SAM" button per row; page numbers in the footer. Sample files: `downloads/SAM-digest-2026-10-21.pdf` (weekday) and `downloads/SAM-digest-2026-10-26.pdf` (Monday, Friday to Sunday). In production the button needs a real, signed PDF URL.
- **Colours (Syn design system):** ink Eerie Black `#151515`, secondary text Jet `#343434`, panels and e-mail ground Cultured `#f1f1f1`, dividers and card borders Silver Chalince `#a7b0b3`, brand bars Candy Apple `#ff1900`. Types: Request outlined in Eerie Black; Direct booking Amber `#fe7d00` and Booking Dodger Blue `#459af7`, both with bold white text as design asked (2.5:1 and 2.9:1, below 4.5:1: Eerie Black text would pass if needed). Summary project rows Cultured `#f1f1f1` with 8px corners (the earlier Misty Rose and red edge read as an error), Total Eerie Black. PDF: the same black header as the e-mails; four separate KPI tiles (12px corners); each project is one card (12px) whose entries are grouped as Requests, Direct bookings and Bookings, each group a card with 8px corners, a light grey header with the coloured type pill, and columns Resource / Item / Details / Created (ordered by resource type, then time). E-mail: three separate KPI tiles and the period box with 12px corners, project cards 12px, groups 8px. "Download as PDF" is a Syn primary button (Eerie Black, Cultured text, 8px corners, hover 74% opacity); "Open project in SAM" a white button in the black project header.
- Truck transport requests are shown as a fourth resource type; whether they belong in the digest is still open in the specification.

## Validation rules in the prototype

- **Login e-mail:** the prototype knows one account, `workEmail` (default `m.becker@baugruppe-nord.de`, the invited account from the e-mail; any letter case). Sign in with any other e-mail shows the "not added by an administrator" error; editing the e-mail clears it.
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
| `loginError` | `none` \| `email` \| `google` \| `microsoft` | `none` | Opens Login already showing that error (the `#not-invited…` hashes do the same) |
| `linkUsed` | boolean | false | Shows the "activation link already used" notice |
| `brand` | `SAM` \| `RAM` | `SAM` | Branding |
| `firstName`, `workEmail` | text | `Max`, `m.becker@baugruppe-nord.de` | Name and invited e-mail on the activation screen; `workEmail` is also the account the login accepts |

Invitation email props: `linkState` (`valid`/`used`/`broken`), `expiryDays` (default 7), `showAccessList`, `showLanguageNote`.

## Visual tokens

- **Fonts:** ABC Favorit Expanded (`FavoritExp`) for headlines, ABC Favorit Extended (`FavoritExt`) for UI, with Helvetica as fallback. These are licensed Dinamo fonts and are currently inlined in the prototype, so production needs a proper web license.
- **Palette:** every screen, e-mail and the map use the Syn design system colours (Figma names). Login and activation are dark: ground Eerie Black `#151515`; text White `#ffffff`, supporting copy Cultured `#f1f1f1`, secondary and placeholders Silver Chalince `#a7b0b3` (8.3:1 on Eerie Black); field lines and outline-button borders Silver Chalince (field boundaries need 3:1); dividers, notices and button hover fills Jet `#343434`.
- **Primary button (login):** Candy Apple `#ff1900` with Eerie Black text (4.7:1; white on Candy Apple is 3.9:1 and fails at 14px). Hover fades to 74% opacity (Syn hover). Disabled: Gray X `#b9b9b9` with Jet `#343434` text (6.4:1).
- **Status:** inline errors Honey `#ffb30f` (10.2:1 on Eerie Black; Syn's error red Vermilion `#ec0808` is only 4.0:1 on the dark ground, so it is not used there) · success Mantis `#71c562` · brand red for kickers and required marks Candy Apple `#ff1900`.
- **Primary button:** 320px max width, 15px vertical padding, 14px bold, no radius
- **Inputs:** floating labels (13px → 10px on focus or when filled), 130ms transition
- **SSO buttons:** transparent, 1px Silver Chalince `#a7b0b3` border (hover White border, Jet fill), 48px tall, two across in 320px; they wrap to one per row when narrow
- **Invitation e-mails:** ground Cultured `#f1f1f1`, card White, text Eerie Black, secondary text Jet `#343434`, dividers Silver Chalince, header and footer Eerie Black. "Activate account" is a Syn primary button: Eerie Black with Cultured text, hover 74% opacity; the brand red stays on the logo, the kicker and the list bullets.

## Responsive behaviour

- **Auth screens (≤ 960px):** the photo panel is hidden and the form takes the full width with 20px side padding; the 6 code fields share the row.
- Checked at 375px and 1280px: no horizontal scrolling on any step.

## Notes for engineering

- The prototype uses inline styles and local state only. There is no backend: codes, passwords, invites and accounts are not really checked.
- The email is a design mock. It needs rebuilding as table-based HTML for email clients, and the CTA URLs must be replaced with real signed activation links.
- The login visual (the excavator scene) comes from `excavator-scene.js`.
- Removed in November: the 5-step onboarding wizard and its end screen (`SAM 12 Setup complete`, with the globe background `globe-bg.js`), and the old separate copies `SAM Login.dc.html` and `SAM-Login-standalone.html`.
