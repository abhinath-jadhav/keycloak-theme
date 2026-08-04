# Supabase-style dark theme for Admin & Account consoles

## Context

This project is a Keycloakify theme repo with three independently-built themes: **login** (shadcn/Tailwind, token-based, has a working light/dark system already), **admin** (PatternFly 5, `@keycloakify/keycloak-admin-ui`), and **account** (PatternFly 5, `@keycloakify/keycloak-account-ui`).

Admin and account currently ship a "modern brand" pass (violet/indigo accent, always-dark sidebar/masthead chrome, rounded corners, layered shadows) applied via `src/admin/index.css` and `src/account/branding.css`. These two files are near-duplicates of each other. Dark mode exists but is **automatic only** — it follows `prefers-color-scheme` (or a realm-level `darkMode: false` override) via `startColorSchemeManagement()` in `colorScheme.ts` plus a pre-hydration `early-color-scheme.js` script that avoids a white flash. There is no manual toggle UI anywhere in admin or account today.

**Scope**: this spec covers the **admin console** and **account console** only. The login theme is explicitly out of scope. Note for the record: an uncommitted change to `src/login/index.css` currently breaks that theme's `.dark` class (it points at the light-mode CSS variable names instead of the `--keycloakify-shadcn-dark-*` ones `useApplyThemePreset.ts` writes). This is left untouched since login is out of scope.

## Goal

Redesign admin + account to look like Supabase's dashboard: dark-by-default, near-black surfaces, bright green accent, with a real light/dark toggle (Supabase supports both, dark is the default experience).

## 1. Visual language

### Dark mode (default)
| Token | Value | Notes |
|---|---|---|
| Page background | `#171717` | |
| Card/panel background | `#1c1c1c` | |
| Chrome (masthead + sidebar) | `#171717` | Stays dark in **both** light and dark mode — matches the existing "always-dark chrome" pattern already in the codebase, and matches Supabase's own sidebar which never goes light. |
| Border | `#2e2e2e` (opaque) / `rgba(255,255,255,.08)` (hairline) | |
| Text primary | `#ededed` | |
| Text muted | `#a0a0a0` | |
| Accent (brand) | `#3ECF8E` | Supabase green |
| Accent hover | `#34b27b` | |
| Accent deep (on-light contrast) | `#1f9e6b` | |

### Light mode (toggle target)
| Token | Value |
|---|---|
| Page background | `#ffffff` |
| Card/panel background | `#ffffff` / `#f8f8f8` |
| Chrome | same dark `#171717` as above |
| Border | `#e6e6e6` |
| Text primary | `#1f1f1f` |
| Text muted | `#6b6b6b` |
| Accent | same green family as dark mode |

Radius scale, shadow scale, and spacing scale already defined in the current CSS stay as-is — they already read as "modern," they just need their colors swapped from violet/indigo to the green palette above, and dark-mode shadow opacity tuned for near-black backgrounds (already partially done, needs re-tuning against the new darker background).

Semantic colors (success/warning/danger/info) get adjusted so they read correctly against `#171717`/`#1c1c1c` instead of the previous neutral-gray dark background.

## 2. Behavior: dark-by-default with a manual toggle

Current logic (`colorScheme.ts` + `early-color-scheme.js`, admin and account each have their own copy):
1. If realm setting "Dark Mode" is explicitly `false`, force light — no override possible.
2. Otherwise, follow `matchMedia("(prefers-color-scheme: dark)")` live, with a listener that flips the theme if the OS setting changes mid-session.
3. No manual toggle exists in the UI.

New logic:
1. Realm `darkMode: false` still forces light unconditionally (admin policy wins, unchanged).
2. Otherwise, resolve from `localStorage` (`kc-admin-color-scheme` / `kc-account-color-scheme`, one key per app since they're independent SPAs): if the user has manually chosen `"light"` or `"dark"` before, use that.
3. If no stored preference exists yet, default to **dark** (not OS preference — Supabase's own product defaults to dark regardless of OS).
4. A new toggle button lets the user flip the theme; the choice is written to `localStorage` and applied immediately (no reload).
5. Drop the live OS-preference-change listener — once a user has an explicit stored preference, or the default-dark has applied, OS changes shouldn't silently flip the app.

This changes `early-color-scheme.js` (pre-hydration, avoids the white flash) and `colorScheme.ts` (post-hydration, owns the toggle's runtime state) for **both** admin and account — same logic, duplicated per app the same way the rest of this theming already is.

## 3. Component changes

- **New component**: `ColorSchemeToggle` (sun/moon icon button, PatternFly `Button variant="plain"` + `lucide-react` or PatternFly icons) — one implementation, used by both `admin/PageHeader.tsx` and `account/root/Header.tsx` via their existing `toolbarItems` prop (no changes needed to `KeycloakMasthead` itself, it already accepts arbitrary toolbar items).
- **Rewrite**: `src/admin/colorScheme.ts`, `src/account/colorScheme.ts` — add `getStoredColorScheme`, `setColorScheme` (writes localStorage + toggles the DOM class), keep `startColorSchemeManagement` as the initial resolver described above.
- **Rewrite**: `public/keycloak-theme/admin/early-color-scheme.js`, `public/keycloak-theme/account/early-color-scheme.js` — read the same localStorage key, same default-dark fallback, so there's no flash of the wrong theme before React mounts.
- **Recolor**: `src/admin/index.css`, `src/account/branding.css` — replace `--brand-color*` violet/indigo values with the green palette; replace `--neutral-*` and `--chrome-*` scales with the near-black palette; extend the `--pf-v5-global--*` overrides beyond the currently-covered primary/active colors to include background and text color variants (`BackgroundColor--100/200`, `Color--100/200/300`, disabled-color) so stock PatternFly components not explicitly targeted by hand-written selectors (tables, modals, dropdowns, chips, forms) also pick up the dark palette instead of falling back to PatternFly's built-in light defaults.
- **Bug-fix carried over**: `account/branding.css` still uses the broken modifier-class selectors (`.pf-v5-c-button--m-primary`, `.pf-v5-c-alert--m-success`, `.pf-v5-c-alert--m-warning`, `.pf-v5-c-alert--m-danger`, `.pf-v5-c-alert--m-info`, `.pf-v5-c-tabs__link.pf-m-current`) that don't match what PatternFly actually renders (`pf-v5-c-button pf-m-primary` as two space-joined classes, `pf-m-current` on the `<li>` ancestor not the link). `src/admin/index.css` already has this fixed in the uncommitted working tree; the same fix gets ported to account so primary buttons, alerts, and the active tab actually render styled instead of falling through to PatternFly defaults.

## 4. Testing

- `npm run build-keycloak-theme` to produce the theme JAR.
- Deploy to the running local `keycloak` Docker container via `./deploy-to-docker.sh`.
- Use browser automation to walk both consoles in light and dark mode: admin dashboard, a resource list view (e.g. Clients), a modal (e.g. clear-caches), a form; account dashboard/personal info. Confirm: no flash of the wrong theme on load, toggle flips instantly and persists across a reload, no leftover PatternFly stock-blue anywhere, text stays readable (contrast) on the near-black surfaces.
- No automated visual test suite exists for admin/account (Storybook stories only cover the login theme's pages) — verification here is manual/visual through the deployed container, not through `npm run storybook`.

## Out of scope

- Login theme (explicitly excluded by the user this round).
- Fixing the pre-existing, unrelated regression in `src/login/index.css`'s `.dark` block.
- Changing the base radius/spacing scale, only its colors.
