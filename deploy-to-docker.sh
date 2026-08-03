#!/bin/bash

# Keycloak Theme Deployment for Docker
# =====================================

set -e

THEME_JAR="dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"
THEME_NAME="keycloak-theme-auctionbase"

echo ""
echo "🐳 Keycloak Docker Theme Deployment"
echo "====================================="
echo ""

# Check if JAR exists
if [ ! -f "$THEME_JAR" ]; then
    echo "❌ JAR not found! Building theme..."
    npm run build-keycloak-theme
fi

echo "✅ JAR file ready: $THEME_JAR"
echo ""

# Ask for container name
read -p "Enter Keycloak Docker container name (default: keycloak): " CONTAINER_NAME
CONTAINER_NAME=${CONTAINER_NAME:-keycloak}

# Check if container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Container '$CONTAINER_NAME' not found!"
    echo ""
    echo "Available containers:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
    echo ""
    read -p "Enter correct container name: " CONTAINER_NAME
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "⚠️  Container '$CONTAINER_NAME' is not running!"
    read -p "Start the container? (y/n): " START_CONTAINER
    if [ "$START_CONTAINER" = "y" ]; then
        docker start "$CONTAINER_NAME"
        echo "Waiting for container to start..."
        sleep 3
    else
        echo "❌ Container must be running to deploy theme"
        exit 1
    fi
fi

echo ""
echo "📦 Step 1: Copying JAR to container..."
docker cp "$THEME_JAR" "${CONTAINER_NAME}:/opt/keycloak/providers/"

if [ $? -eq 0 ]; then
    echo "✅ JAR copied successfully"
else
    echo "❌ Failed to copy JAR"
    exit 1
fi

echo ""
echo "🔨 Step 2: Rebuilding Keycloak inside container..."
echo "Running: docker exec $CONTAINER_NAME /opt/keycloak/bin/kc.sh build"
docker exec "$CONTAINER_NAME" /opt/keycloak/bin/kc.sh build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🔄 Step 3: Restarting container..."
docker restart "$CONTAINER_NAME"

echo ""
echo "⏳ Waiting for Keycloak to start (30 seconds)..."
sleep 30

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Open Keycloak Admin Console:"
echo "   http://localhost:8080 (or your configured port)"
echo ""
echo "2. Login with admin credentials"
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
echo "6. Test the themes:"
echo "   - Logout to see login theme"
echo "   - Visit /realms/{realm}/account for account theme"
echo "   - Admin console uses admin theme"
echo ""

# Show logs
read -p "Show Keycloak logs? (y/n): " SHOW_LOGS
if [ "$SHOW_LOGS" = "y" ]; then
    echo ""
    echo "📋 Recent Keycloak logs:"
    echo "========================"
    docker logs --tail 50 "$CONTAINER_NAME"
fi

echo ""
