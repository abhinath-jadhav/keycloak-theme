import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";
import { getKcContextMock } from "./login/mocks/getKcContextMock";
import { getKcContext as getAdminKcContext } from "./admin/KcContext";
import { getKcContext as getAccountKcContext } from "./account/KcContext";

// You can change this to test different themes: "login", "admin", or "account"
const THEME_TYPE = (import.meta.env.VITE_THEME_TYPE as "login" | "admin" | "account") || "login";

const getKcContext = () => {
    switch (THEME_TYPE) {
        case "admin": {
            const { kcContext } = getAdminKcContext();
            return kcContext;
        }
        case "account": {
            const { kcContext } = getAccountKcContext();
            return kcContext;
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

if (!kcContext) {
    throw new Error(`No KcContext found for theme type: ${THEME_TYPE}`);
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <KcPage kcContext={kcContext} />
    </StrictMode>
);
