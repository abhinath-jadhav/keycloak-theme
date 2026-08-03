# Theme Development - Important Information

## Local Development Limitations

### ✅ Login Theme - CAN be previewed locally
The **login theme** can be developed and previewed locally because it uses mock data:

```bash
npm run dev
# or
npm run dev:login
```

Open: http://localhost:5173

### ⚠️ Admin & Account Themes - CANNOT be previewed locally

The **admin** and **account** themes are **Single Page Applications (SPAs)** that:
- Require authentication context from Keycloak
- Need Keycloak's REST API endpoints
- Use OIDC authentication flow
- Cannot function without a real Keycloak instance

When you run:
```bash
npm run dev:admin
npm run dev:account
```

You'll see a helpful message explaining that these themes must be deployed to Keycloak to be previewed.

## Why Can't Admin/Account Themes Run Locally?

Unlike the login theme (which is server-side rendered FreeMarker templates), the admin and account consoles are:

1. **Full React SPAs** - They need to authenticate with Keycloak
2. **API-Dependent** - They make hundreds of REST API calls to Keycloak
3. **OIDC-Based** - They use OAuth2/OIDC flows that require a running Keycloak server
4. **Context-Dependent** - They need realm configuration, users, clients, etc.

Creating mock data for these would require essentially reimplementing Keycloak's entire API.

## How to Preview Admin & Account Themes

### Step 1: Build the Theme
```bash
npm run build-keycloak-theme
```

### Step 2: Deploy to Keycloak
```bash
./deploy-to-docker.sh
```

Or manually:
```bash
docker cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar keycloak:/opt/keycloak/providers/
docker exec keycloak /opt/keycloak/bin/kc.sh build
docker restart keycloak
```

### Step 3: Select Theme in Keycloak
1. Open: http://localhost:8080
2. Login to admin console
3. Realm Settings → Themes
4. Select `keycloak-theme-auctionbase` for:
   - Admin Console Theme
   - Account Theme
5. Save

### Step 4: View the Themes

**Admin Console:**
- Already visible! You're using it when you're in the admin panel
- URL: http://localhost:8080/admin

**Account Console:**
- URL: http://localhost:8080/realms/{realm-name}/account
- Example: http://localhost:8080/realms/master/account

## Development Workflow

### For Login Theme Changes
1. Edit files in `src/login/`
2. See changes instantly at http://localhost:5173
3. No rebuild needed (hot reload works)

### For Admin/Account Theme Changes
1. Edit files in `src/admin/` or `src/account/`
2. Build: `npm run build-keycloak-theme`
3. Deploy: `./deploy-to-docker.sh`
4. Refresh Keycloak admin console (Ctrl+Shift+R)
5. See your changes

## Quick Reference

| Theme | Local Preview | Where to Edit | How to See Changes |
|-------|---------------|---------------|-------------------|
| **Login** | ✅ Yes | `src/login/` | `npm run dev` → http://localhost:5173 |
| **Admin** | ❌ No | `src/admin/` | Build → Deploy → View at Keycloak admin |
| **Account** | ❌ No | `src/account/` | Build → Deploy → View at `/realms/{realm}/account` |

## Styling Tips

All three themes share similar PatternFly components, so:

### Admin Theme Styling
Edit: `src/admin/index.css`

### Account Theme Styling
Edit: `src/account/branding.css`

### Login Theme Styling
Edit: `src/login/pages/*/styles.css` and `src/login/components/Template/theme/`

## Common Questions

### Q: Why do I see a blank screen for admin/account in dev mode?
**A:** These themes require Keycloak. Deploy them to see them work.

### Q: Can I mock the admin/account context?
**A:** Technically possible but extremely complex. You'd need to mock:
- OIDC authentication
- ~100+ REST API endpoints
- WebSocket connections
- File uploads
- Complex state management
- Realm configuration
- User database

It's much faster to just deploy to Keycloak.

### Q: How long does build + deploy take?
**A:** Usually 30-60 seconds total:
- Build: 15-25 seconds
- Deploy: 15-30 seconds

### Q: Can I test styling without deploying?
**A:** Yes! The login theme shares many components. Test your CSS changes there first:
```bash
npm run dev
```

Most PatternFly component styling will apply to all three themes.

## Best Practices

1. **Test login theme frequently** - It gives immediate feedback
2. **Make batch changes** - Group admin/account changes to minimize rebuilds
3. **Use browser dev tools** - Inspect elements in Keycloak to fine-tune CSS
4. **Keep Keycloak running** - Restart is faster than full startup
5. **Clear browser cache** - Always do Ctrl+Shift+R after deploying

## Troubleshooting

### "I deployed but don't see changes"
1. Clear browser cache (Ctrl+Shift+R)
2. Check Keycloak logs: `docker logs keycloak`
3. Verify theme is selected in Realm Settings
4. Try a different browser (no cache)

### "Build is slow"
- Normal! Building all 3 themes + assets takes time
- Use `npm run build` alone to test build without packaging

### "Deploy script fails"
- Check Docker container is running: `docker ps`
- Verify container name: `docker ps | grep keycloak`
- Check logs: `docker logs keycloak`

## Summary

✅ **DO**: Use `npm run dev` for login theme development  
❌ **DON'T**: Expect admin/account themes to work locally  
✅ **DO**: Deploy to Keycloak to preview admin/account themes  
✅ **DO**: Test CSS in login theme first (faster iteration)

For more help, see:
- `DOCKER_DEPLOYMENT.md` - Deployment guide
- `MODERN_THEME_APPLIED.md` - Styling guide
- `THEME_DEVELOPMENT.md` - General development info
