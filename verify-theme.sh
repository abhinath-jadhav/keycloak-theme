#!/bin/bash

# Keycloak Theme Verification Script
# Run this to verify your theme JAR is correctly built

echo "═══════════════════════════════════════════════════════"
echo "  Keycloak Theme Verification"
echo "═══════════════════════════════════════════════════════"
echo ""

JAR_FILE="dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"

# Check if JAR exists
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ ERROR: JAR file not found at: $JAR_FILE"
    echo "   Run: npm run build-keycloak-theme"
    exit 1
fi

echo "✅ JAR file found: $JAR_FILE"
echo "   Size: $(du -h $JAR_FILE | cut -f1)"
echo ""

# Check for theme.properties files
echo "📋 Checking for theme.properties files..."
THEME_PROPS=$(unzip -l "$JAR_FILE" 2>/dev/null | grep "theme.properties" | wc -l | tr -d ' ')
if [ "$THEME_PROPS" -eq 3 ]; then
    echo "✅ Found 3 theme.properties files (login, account, admin)"
    unzip -l "$JAR_FILE" 2>/dev/null | grep "theme.properties"
else
    echo "❌ ERROR: Expected 3 theme.properties files, found: $THEME_PROPS"
    unzip -l "$JAR_FILE" 2>/dev/null | grep "theme.properties"
fi
echo ""

# Check theme name
echo "📝 Checking theme name..."
THEME_NAME=$(unzip -l "$JAR_FILE" 2>/dev/null | grep "theme/" | head -1 | awk '{print $4}' | cut -d'/' -f2)
if [ -n "$THEME_NAME" ]; then
    echo "✅ Theme name: $THEME_NAME"
else
    echo "❌ ERROR: Could not detect theme name"
fi
echo ""

# Check for index.html files
echo "🌐 Checking for index.html files..."
INDEX_COUNT=$(unzip -l "$JAR_FILE" 2>/dev/null | grep "resources/dist/index.html" | wc -l | tr -d ' ')
if [ "$INDEX_COUNT" -ge 2 ]; then
    echo "✅ Found $INDEX_COUNT index.html files"
    unzip -l "$JAR_FILE" 2>/dev/null | grep "resources/dist/index.html"
else
    echo "⚠️  WARNING: Found only $INDEX_COUNT index.html files"
fi
echo ""

# Check for assets
echo "🎨 Checking for assets..."
ADMIN_ASSETS=$(unzip -l "$JAR_FILE" 2>/dev/null | grep "admin/resources/dist/assets" | wc -l | tr -d ' ')
ACCOUNT_ASSETS=$(unzip -l "$JAR_FILE" 2>/dev/null | grep "account/resources/dist/assets" | wc -l | tr -d ' ')
LOGIN_ASSETS=$(unzip -l "$JAR_FILE" 2>/dev/null | grep "login/resources/dist/assets" | wc -l | tr -d ' ')

echo "   Admin assets:   $ADMIN_ASSETS files"
echo "   Account assets: $ACCOUNT_ASSETS files"
echo "   Login assets:   $LOGIN_ASSETS files"

if [ "$ADMIN_ASSETS" -gt 100 ] && [ "$ACCOUNT_ASSETS" -gt 100 ] && [ "$LOGIN_ASSETS" -gt 100 ]; then
    echo "✅ All themes have sufficient assets"
else
    echo "⚠️  WARNING: Some themes may be missing assets"
fi
echo ""

# Check manifest
echo "📦 Checking JAR manifest..."
MANIFEST=$(unzip -p "$JAR_FILE" META-INF/MANIFEST.MF 2>/dev/null)
if [ -n "$MANIFEST" ]; then
    echo "✅ Manifest found:"
    echo "$MANIFEST" | head -5
else
    echo "⚠️  WARNING: No manifest found"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════"
echo "  Summary"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Theme Name:    $THEME_NAME"
echo "JAR File:      $JAR_FILE"
echo "Theme Count:   3 (login, account, admin)"
echo ""

if [ "$THEME_PROPS" -eq 3 ] && [ "$INDEX_COUNT" -ge 2 ] && [ -n "$THEME_NAME" ]; then
    echo "✅ JAR appears to be correctly built!"
    echo ""
    echo "Next steps:"
    echo "1. Copy to Keycloak providers:"
    echo "   cp $JAR_FILE /path/to/keycloak/providers/"
    echo ""
    echo "2. Rebuild Keycloak (REQUIRED for KC 26+):"
    echo "   cd /path/to/keycloak"
    echo "   ./bin/kc.sh build"
    echo ""
    echo "3. Start Keycloak:"
    echo "   ./bin/kc.sh start-dev"
    echo ""
    echo "4. Select theme '$THEME_NAME' in admin console:"
    echo "   Realm Settings → Themes → Login/Account/Admin Theme"
else
    echo "⚠️  WARNING: JAR may have issues. Check errors above."
fi
echo ""
