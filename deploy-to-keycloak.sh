#!/bin/bash

# Quick Keycloak Theme Deployment for KC 26
# ==========================================

set -e

THEME_JAR="dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"
THEME_NAME="keycloak-theme-auctionbase"

echo ""
echo "🎨 Keycloak Theme Deployment Script"
echo "====================================="
echo ""
echo "Theme: $THEME_NAME"
echo "JAR:   $THEME_JAR"
echo ""

# Check if JAR exists
if [ ! -f "$THEME_JAR" ]; then
    echo "❌ JAR not found! Building theme..."
    npm run build-keycloak-theme
fi

echo "✅ JAR file ready"
echo ""

# Ask for Keycloak path
read -p "Enter Keycloak installation path (e.g., /opt/keycloak): " KC_PATH

if [ ! -d "$KC_PATH" ]; then
    echo "❌ ERROR: Keycloak path not found: $KC_PATH"
    exit 1
fi

echo ""
echo "📦 Step 1: Copying JAR to providers directory..."
cp -v "$THEME_JAR" "$KC_PATH/providers/"

echo ""
echo "🔨 Step 2: Rebuilding Keycloak (REQUIRED!)..."
echo "Running: $KC_PATH/bin/kc.sh build"
"$KC_PATH/bin/kc.sh" build

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Start Keycloak:"
echo "   $KC_PATH/bin/kc.sh start-dev"
echo ""
echo "2. Open Keycloak Admin Console"
echo ""
echo "3. Go to: Realm Settings → Themes"
echo ""
echo "4. Select '$THEME_NAME' from dropdowns:"
echo "   - Login Theme"
echo "   - Account Theme"
echo "   - Admin Console Theme"
echo ""
echo "5. Click Save"
echo ""
