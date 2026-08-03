# Keycloak Theme Deployment Guide (Keycloak 26)

## Theme Information
- **Theme Name**: `keycloak-theme-auctionbase`
- **JAR File**: `keycloak-theme-for-kc-all-other-versions.jar`
- **Keycloak Version**: 26.x

## Step-by-Step Deployment

### Step 1: Copy JAR to Keycloak

Copy the JAR file to the Keycloak providers directory:

```bash
# For Keycloak 26+
cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /path/to/keycloak/providers/
```

**Common Keycloak paths:**
- Standalone: `/opt/keycloak/providers/`
- Docker: Volume mount to `/opt/keycloak/providers/`
- Dev mode: `{KEYCLOAK_HOME}/providers/`

### Step 2: Rebuild Keycloak (CRITICAL!)

Keycloak 26+ requires rebuilding after adding providers:

```bash
# Stop Keycloak first (if running)

# Then rebuild
cd /path/to/keycloak
./bin/kc.sh build

# Or for Windows
bin\kc.bat build
```

**⚠️ IMPORTANT**: Without running `build`, the theme will NOT appear in the dropdown!

### Step 3: Start Keycloak

```bash
# For development
./bin/kc.sh start-dev

# For production
./bin/kc.sh start
```

### Step 4: Verify Theme is Loaded

Check Keycloak logs for confirmation:

```bash
# Look for theme loading messages
tail -f data/log/keycloak.log

# You should see something like:
# "Theme keycloak-theme-auctionbase loaded"
```

### Step 5: Select Theme in Admin Console

1. Log into Keycloak Admin Console
2. Select your realm (or create a new one for testing)
3. Go to **Realm Settings** → **Themes** tab
4. You should now see `keycloak-theme-auctionbase` in the dropdowns:
   - **Login Theme**: Select `keycloak-theme-auctionbase`
   - **Account Theme**: Select `keycloak-theme-auctionbase`
   - **Admin Console Theme**: Select `keycloak-theme-auctionbase`
5. Click **Save**

## Troubleshooting

### Theme Not Showing in Dropdown

#### Solution 1: Verify JAR is in Correct Location
```bash
# List providers directory
ls -la /path/to/keycloak/providers/

# You should see: keycloak-theme-for-kc-all-other-versions.jar
```

#### Solution 2: Run Keycloak Build Command
```bash
cd /path/to/keycloak
./bin/kc.sh build
```

This is **REQUIRED** for Keycloak 26+. The build command:
- Processes all providers
- Registers themes
- Optimizes startup

#### Solution 3: Check File Permissions
```bash
# Make sure the JAR is readable
chmod 644 /path/to/keycloak/providers/keycloak-theme-for-kc-all-other-versions.jar
```

#### Solution 4: Verify JAR Contents
```bash
# Check if theme directory exists in JAR
unzip -l /path/to/keycloak/providers/keycloak-theme-for-kc-all-other-versions.jar | grep "theme/keycloak-theme-auctionbase"

# Should show:
# theme/keycloak-theme-auctionbase/login/
# theme/keycloak-theme-auctionbase/account/
# theme/keycloak-theme-auctionbase/admin/
```

#### Solution 5: Check Keycloak Logs
```bash
# Start Keycloak with debug logging
./bin/kc.sh start-dev --log-level=DEBUG

# Check for theme loading errors
grep -i "theme" data/log/keycloak.log
grep -i "keycloak-theme-auctionbase" data/log/keycloak.log
```

#### Solution 6: Clear Keycloak Cache
```bash
# Stop Keycloak
# Delete cache directories
rm -rf data/tmp/*
rm -rf data/cache/*

# Rebuild and restart
./bin/kc.sh build
./bin/kc.sh start-dev
```

#### Solution 7: Test with Fresh Realm
1. Create a new test realm
2. Try selecting the theme in the new realm
3. Sometimes theme selection is cached per realm

### Docker Deployment

If using Docker:

```bash
# Copy JAR into container
docker cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar keycloak:/opt/keycloak/providers/

# Restart container
docker restart keycloak

# Or if using docker-compose
docker-compose restart keycloak
```

**Better approach - Use volume mount:**

```yaml
# docker-compose.yml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    volumes:
      - ./dist_keycloak:/opt/keycloak/providers
    command: start-dev
```

### Verify Theme Loaded via API

```bash
# Get available themes
curl -s http://localhost:8080/realms/master/protocol/openid-connect/token \
  -d "client_id=admin-cli" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password" | jq -r '.access_token' > /tmp/token.txt

# Check themes
curl -H "Authorization: Bearer $(cat /tmp/token.txt)" \
  http://localhost:8080/admin/realms/master/ui-ext/themes
```

## Quick Checklist

Before asking "why isn't my theme showing?", verify:

- [ ] JAR file is in `/opt/keycloak/providers/` (or equivalent)
- [ ] File permissions are correct (readable by Keycloak user)
- [ ] `./bin/kc.sh build` was executed **AFTER** copying the JAR
- [ ] Keycloak was restarted after build
- [ ] You're looking in the correct realm's theme settings
- [ ] Browser cache is cleared (Ctrl+Shift+R)
- [ ] Keycloak logs don't show errors

## Common Mistakes

### ❌ Mistake 1: Skipping the Build Step
```bash
# Wrong: Just copying and restarting
cp theme.jar /opt/keycloak/providers/
./bin/kc.sh start-dev  # ❌ Theme won't load!
```

```bash
# Correct: Copy, build, then start
cp theme.jar /opt/keycloak/providers/
./bin/kc.sh build       # ✅ Build first!
./bin/kc.sh start-dev
```

### ❌ Mistake 2: Wrong Directory
```bash
# Wrong paths:
/opt/keycloak/themes/           # This is for old Keycloak versions
/opt/keycloak/standalone/       # This is for WildFly/JBoss

# Correct path for Keycloak 17+:
/opt/keycloak/providers/        # ✅
```

### ❌ Mistake 3: Looking in Wrong Theme Section
Make sure you're in:
- **Realm Settings** → **Themes** tab
  
NOT:
- **Realm Settings** → **Localization** (wrong tab!)
- **Clients** → Client's theme settings (client-specific, not realm-wide)

## Testing the Theme

### Test Login Theme
1. Log out of Keycloak admin
2. Go to the login page
3. You should see your custom theme

### Test Account Theme
1. Log in as a user
2. Go to: `http://localhost:8080/realms/{realm-name}/account`
3. You should see your custom account console

### Test Admin Theme
1. Log in to admin console
2. The admin UI itself should use your theme
3. Check if custom styling is applied

## Environment Variables

Your theme supports these environment variables. Set them in Keycloak:

**Realm Settings → Themes → (scroll down) → Theme Properties:**

```properties
SHADCN_THEME_LOGO_WHITE_URL=https://example.com/logo-white.png
SHADCN_THEME_LOGO_DARK_URL=https://example.com/logo-dark.png
SHADCN_THEME_APP_NAME=My Company
SHADCN_THEME_LAYOUT=centered-card
SHADCN_THEME_PRESET=neutral
```

Or set them as Keycloak environment variables:

```bash
export KC_SHADCN_THEME_APP_NAME="My Company"
./bin/kc.sh start-dev
```

## Need More Help?

If the theme still doesn't appear:

1. **Share Keycloak logs**:
   ```bash
   tail -100 data/log/keycloak.log
   ```

2. **Verify JAR structure**:
   ```bash
   unzip -l /path/to/keycloak/providers/*.jar | grep theme.properties
   ```

3. **Check Keycloak version**:
   ```bash
   ./bin/kc.sh --version
   ```

4. **Test with a minimal example**: Try deploying the Keycloak default theme JAR to ensure the problem isn't with Keycloak itself
