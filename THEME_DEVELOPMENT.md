# Keycloak Theme Development Guide

This project contains **three Keycloak themes**:
- **Login Theme** - Custom login pages
- **Admin Console Theme** - Keycloak admin UI
- **Account Console Theme** - User account management UI

## Development Mode

### Testing Different Themes Locally

You can test each theme separately in development mode:

```bash
# Test Login Theme (default)
npm run dev
# or
npm run dev:login

# Test Admin Theme
npm run dev:admin

# Test Account Theme
npm run dev:account
```

The dev server will start at `http://localhost:5173`

### How It Works

The `src/main-kc.dev.tsx` file checks the `VITE_THEME_TYPE` environment variable to determine which theme to load:
- `login` (default) - Uses mock context from `src/login/mocks/getKcContextMock.ts`
- `admin` - Loads the admin console theme
- `account` - Loads the account console theme

## Building for Production

### Build the Vite Project

```bash
npm run build
```

This creates the `dist/` directory with compiled assets.

### Build Keycloak Theme JARs

```bash
npm run build-keycloak-theme
```

This command:
1. Runs `npm run build` to compile the project
2. Runs `keycloakify build` to package everything into JAR files

The output will be in `dist_keycloak/`:
- `keycloak-theme-for-kc-22-to-25.jar` - For Keycloak 22-25
- `keycloak-theme-for-kc-all-other-versions.jar` - For other Keycloak versions

## Verifying Themes in JAR

To verify all three themes are included in the JAR file:

```bash
# List admin theme contents
unzip -l dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar | grep "admin/theme.properties"

# List account theme contents
unzip -l dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar | grep "account/theme.properties"

# List login theme contents
unzip -l dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar | grep "login/theme.properties"

# Count assets for each theme
unzip -l dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar | grep "admin/resources/dist/assets" | wc -l
unzip -l dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar | grep "account/resources/dist/assets" | wc -l
unzip -l dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar | grep "login/resources/dist/assets" | wc -l
```

## Deploying to Keycloak

1. Copy the JAR file to your Keycloak providers directory:
   ```bash
   cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /path/to/keycloak/providers/
   ```

2. Restart Keycloak or run build command:
   ```bash
   # For Keycloak in dev mode
   bin/kc.sh build
   
   # Then start Keycloak
   bin/kc.sh start-dev
   ```

3. In Keycloak Admin Console:
   - For **Login Theme**: Realm Settings → Themes → Login Theme → Select `keycloak-theme-auctionbase`
   - For **Account Theme**: Realm Settings → Themes → Account Theme → Select `keycloak-theme-auctionbase`
   - For **Admin Console**: Realm Settings → Themes → Admin Console Theme → Select `keycloak-theme-auctionbase`

## Theme Configuration

All themes support the following environment variables (configured in `vite.config.ts`):

- `SHADCN_THEME_LOGO_WHITE_URL` - Logo for light mode
- `SHADCN_THEME_LOGO_DARK_URL` - Logo for dark mode
- `SHADCN_THEME_APP_NAME` - Application name (default: "Acme Inc.")
- `SHADCN_THEME_LAYOUT` - Layout style (default: "centered-card")
- `SHADCN_THEME_SIDE_IMAGE_URL` - Side image URL for login
- `SHADCN_THEME_PRESET` - Color preset (default: "neutral")
- `SHADCN_THEME_BASE` - Base theme (default: "neutral")
- `SHADCN_THEME_RADIUS` - Border radius (default: "default")
- `SHADCN_THEME_FONT` - Font family (default: "geist")
- `SHADCN_THEME_PLACEHOLDER` - Show placeholder (default: "true")

These can be set in Keycloak via realm settings.

## Project Structure

```
src/
├── admin/          # Admin Console theme
│   ├── KcPage.tsx
│   ├── KcContext.ts
│   └── KcAdminUi.tsx
├── account/        # Account Console theme
│   ├── KcPage.tsx
│   ├── KcContext.ts
│   └── KcAccountUi.tsx
├── login/          # Login theme
│   ├── KcPage.tsx
│   ├── KcContext.ts
│   └── pages/
├── kc.gen.tsx      # Auto-generated theme router
├── main.tsx        # Production entry point
└── main-kc.dev.tsx # Development entry point
```

## Troubleshooting

### Theme not showing in Keycloak dropdown

1. Verify the JAR is in the `providers/` directory
2. Run `bin/kc.sh build` to rebuild Keycloak
3. Restart Keycloak
4. Clear browser cache

### Dev mode shows wrong theme

Make sure you're using the correct npm script:
- `npm run dev:admin` for admin theme
- `npm run dev:account` for account theme
- `npm run dev` or `npm run dev:login` for login theme

### Build errors

1. Run `npm run lint` to check for errors
2. Run `npm run build` separately to identify build issues
3. Check that all dependencies are installed: `npm install`

## Additional Scripts

- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run storybook` - Start Storybook for component development
- `npm run build-storybook` - Build Storybook
