# Keycloak Theme Deployment for Docker (Keycloak 26)

## Quick Start (Automated)

Run the deployment script:

```bash
./deploy-to-docker.sh
```

It will prompt for your container name and handle everything automatically.

---

## Manual Deployment Steps

### Step 1: Find Your Keycloak Container Name

```bash
# List all running containers
docker ps

# Or list all containers (including stopped)
docker ps -a

# Look for your Keycloak container, the name might be:
# - keycloak
# - keycloak_1
# - your-project-keycloak-1
```

### Step 2: Copy JAR to Docker Container

```bash
# Replace 'keycloak' with your actual container name
docker cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar keycloak:/opt/keycloak/providers/
```

**Verify the copy worked:**
```bash
docker exec keycloak ls -lh /opt/keycloak/providers/
```

You should see `keycloak-theme-for-kc-all-other-versions.jar` in the list.

### Step 3: Run Build Command Inside Container

**This is the critical step!** Execute the build command **inside** the Docker container:

```bash
docker exec keycloak /opt/keycloak/bin/kc.sh build
```

**Expected output:**
```
Updating the configuration and installing your custom providers, if any. Please wait.
...
Server configuration updated and persisted. Run the following command to review the configuration:
    kc.sh show-config
```

### Step 4: Restart the Container

```bash
docker restart keycloak
```

### Step 5: Wait for Keycloak to Start

```bash
# Watch the logs
docker logs -f keycloak

# Wait until you see:
# "Keycloak 26.x.x started in XXXms"
# Then press Ctrl+C
```

### Step 6: Select Theme in Admin Console

1. Open: http://localhost:8080 (or your configured port)
2. Login with admin credentials
3. Go to: **Realm Settings → Themes**
4. Select **`keycloak-theme-auctionbase`** from:
   - Login Theme
   - Account Theme
   - Admin Console Theme
5. Click **Save**

---

## Docker Compose Setup

If you're using Docker Compose, here's the best way to set it up:

### Option A: Volume Mount (Recommended)

Add a volume mount to your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    container_name: keycloak
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    volumes:
      # Mount the entire dist_keycloak directory
      - ./dist_keycloak:/opt/keycloak/providers
    command: start-dev
```

**Then:**
```bash
# Rebuild and restart
docker-compose down
docker-compose up -d

# The build will happen automatically on startup
```

### Option B: Copy During Build

Create a custom Dockerfile:

```dockerfile
# Dockerfile
FROM quay.io/keycloak/keycloak:26.0

# Copy theme JAR
COPY dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/

# Run build
RUN /opt/keycloak/bin/kc.sh build

# Start in dev mode
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  keycloak:
    build: .
    container_name: keycloak
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
```

**Deploy:**
```bash
docker-compose build
docker-compose up -d
```

---

## Troubleshooting Docker Deployment

### Theme Not Showing After Deployment

**1. Verify JAR is in container:**
```bash
docker exec keycloak ls -lh /opt/keycloak/providers/
```

**2. Check if build was run:**
```bash
# Check container logs for build output
docker logs keycloak 2>&1 | grep -i "build"
```

**3. Verify theme is loaded:**
```bash
docker exec keycloak ls -lh /opt/keycloak/lib/lib/main/*.jar | grep theme
```

**4. Check Keycloak logs for errors:**
```bash
docker logs keycloak 2>&1 | grep -i theme
docker logs keycloak 2>&1 | grep -i error
```

### Permission Issues

If you get permission errors:

```bash
# Fix permissions on the JAR
chmod 644 dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar

# Or if already copied to container:
docker exec keycloak chmod 644 /opt/keycloak/providers/keycloak-theme-for-kc-all-other-versions.jar
```

### Container Won't Start After Adding Theme

```bash
# Check logs for errors
docker logs keycloak

# If build failed, remove the JAR and restart
docker exec keycloak rm /opt/keycloak/providers/keycloak-theme-for-kc-all-other-versions.jar
docker restart keycloak
```

### Rebuild Without Restarting (Advanced)

```bash
# Run build without restart
docker exec keycloak /opt/keycloak/bin/kc.sh build

# Then restart just the Keycloak process (if possible)
# Usually requires a container restart for themes
docker restart keycloak
```

---

## Common Docker Commands

### View Logs
```bash
# Real-time logs
docker logs -f keycloak

# Last 100 lines
docker logs --tail 100 keycloak

# Search for theme
docker logs keycloak 2>&1 | grep -i "keycloak-theme-auctionbase"
```

### Execute Commands in Container
```bash
# Open shell in container
docker exec -it keycloak /bin/bash

# Inside container, you can run:
cd /opt/keycloak
./bin/kc.sh --version
ls -la providers/
```

### Copy Files from Container
```bash
# Copy logs from container
docker cp keycloak:/opt/keycloak/data/log/keycloak.log ./keycloak.log
```

### Clean Restart
```bash
# Stop and remove container
docker stop keycloak
docker rm keycloak

# Start fresh (if using docker-compose)
docker-compose up -d
```

---

## Testing the Deployment

### Test Login Theme
```bash
# Logout from admin console
# Visit login page
open http://localhost:8080/realms/master/protocol/openid-connect/auth?client_id=security-admin-console&redirect_uri=http://localhost:8080/admin/master/console/&response_type=code
```

### Test Account Theme
```bash
# Visit account console
open http://localhost:8080/realms/master/account
```

### Test Admin Theme
- The admin console itself should use your theme
- Check if custom styling is applied at http://localhost:8080/admin

---

## Docker Compose Full Example

Here's a complete working example:

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: keycloak-db
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    container_name: keycloak
    depends_on:
      - postgres
    ports:
      - "8080:8080"
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: password
      KC_HOSTNAME: localhost
      KC_HOSTNAME_PORT: 8080
      KC_HOSTNAME_STRICT: false
      KC_HOSTNAME_STRICT_HTTPS: false
      KC_LOG_LEVEL: info
      KC_METRICS_ENABLED: true
      KC_HEALTH_ENABLED: true
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    volumes:
      - ./dist_keycloak:/opt/keycloak/providers
    command: start-dev

volumes:
  postgres_data:
```

**Deploy:**
```bash
# First time setup
npm run build-keycloak-theme
docker-compose up -d
docker exec keycloak /opt/keycloak/bin/kc.sh build
docker restart keycloak

# After theme updates
npm run build-keycloak-theme
docker restart keycloak
# (No need to run build again if using volume mount)
```

---

## Quick Reference

### Deploy theme to running container:
```bash
./deploy-to-docker.sh
```

### Or manually:
```bash
docker cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar keycloak:/opt/keycloak/providers/
docker exec keycloak /opt/keycloak/bin/kc.sh build
docker restart keycloak
```

### Verify deployment:
```bash
docker logs keycloak 2>&1 | grep -i "keycloak-theme-auctionbase"
```

### Theme name in admin console:
**`keycloak-theme-auctionbase`**

---

Need help? Check the logs:
```bash
docker logs keycloak
```
