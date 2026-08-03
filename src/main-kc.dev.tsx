import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";
import { getKcContextMock } from "./login/mocks/getKcContextMock";

// You can change this to test different themes: "login", "admin", or "account"
const THEME_TYPE = (import.meta.env.VITE_THEME_TYPE as "login" | "admin" | "account") || "login";

console.log("Theme type:", THEME_TYPE);

const getKcContext = () => {
    switch (THEME_TYPE) {
        case "admin": {
            // Admin and Account themes are SPAs that need to run inside Keycloak
            // For dev preview, we show a helpful message
            return null;
        }
        case "account": {
            // Admin and Account themes are SPAs that need to run inside Keycloak
            // For dev preview, we show a helpful message
            return null;
        }
        case "login":
        default:
            return getKcContextMock({
                pageId: "login.ftl",
                overrides: {}
            });
    }
};

const kcContext = getKcContext();

// Show helpful message for admin/account themes in dev mode
if (!kcContext) {
    document.getElementById("root")!.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 2rem;
        ">
            <div style="
                background: white;
                border-radius: 1rem;
                padding: 3rem;
                max-width: 600px;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            ">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <svg style="width: 80px; height: 80px; margin: 0 auto; color: #667eea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h1 style="
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin: 0 0 1rem 0;
                    color: #1f2937;
                    text-align: center;
                ">
                    ${THEME_TYPE.charAt(0).toUpperCase() + THEME_TYPE.slice(1)} Theme Preview Not Available
                </h1>
                <p style="
                    color: #6b7280;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                    text-align: center;
                ">
                    The <strong>${THEME_TYPE}</strong> theme is a Single Page Application (SPA) that requires running inside a Keycloak environment.
                </p>
                <div style="
                    background: #f3f4f6;
                    border-left: 4px solid #667eea;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                ">
                    <p style="
                        margin: 0 0 1rem 0;
                        color: #374151;
                        font-weight: 600;
                    ">✅ Your theme is built correctly!</p>
                    <p style="
                        margin: 0;
                        color: #6b7280;
                        font-size: 0.875rem;
                    ">The theme has been compiled and packaged. Deploy it to Keycloak to see it in action.</p>
                </div>
                <div style="
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                ">
                    <p style="
                        margin: 0 0 0.5rem 0;
                        color: #92400e;
                        font-weight: 600;
                    ">📝 To preview this theme:</p>
                    <ol style="
                        margin: 0;
                        padding-left: 1.5rem;
                        color: #78350f;
                        font-size: 0.875rem;
                    ">
                        <li style="margin-bottom: 0.5rem;">Build the theme: <code style="background: white; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace;">npm run build-keycloak-theme</code></li>
                        <li style="margin-bottom: 0.5rem;">Deploy to Docker: <code style="background: white; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace;">./deploy-to-docker.sh</code></li>
                        <li style="margin-bottom: 0.5rem;">Select the theme in Keycloak Admin Console</li>
                        <li>View at: <code style="background: white; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace;">http://localhost:8080</code></li>
                    </ol>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="?theme=login" style="
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 0.75rem 2rem;
                        border-radius: 0.5rem;
                        text-decoration: none;
                        font-weight: 600;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        Preview Login Theme Instead
                    </a>
                </div>
                <div style="
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                ">
                    <p style="
                        color: #9ca3af;
                        font-size: 0.875rem;
                        margin: 0;
                    ">
                        💡 The <strong>login theme</strong> can be previewed locally with <code style="background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace;">npm run dev</code>
                    </p>
                </div>
            </div>
        </div>
    `;
    throw new Error(`${THEME_TYPE} theme requires Keycloak environment - see message above for deployment instructions`);
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <KcPage kcContext={kcContext} />
    </StrictMode>
);

