/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/colorScheme.ts" --revert
 */

/* IMPORTANT NOTE:
 * If you modify how the light/dark mode is implemented
 * you must also update public/keycloak-theme/account/early-color-scheme.js
 * This scrip is ran before this to avoid white flashes
 */

import { getKcContext } from "./KcContext";

const DARK_THEME_CLASS = "pf-v5-theme-dark";
const STORAGE_KEY = "kc-account-color-scheme";

export type ColorScheme = "light" | "dark";

function setIsDarkModeEnabled(isDarkModeEnabled: boolean) {
    {
        const elementId = "root-color-scheme-style";

        // Remove the style tag that might have been added by early-color-scheme.js
        document.getElementById(elementId)?.remove();

        const element = document.createElement("style");

        element.id = elementId;

        element.innerHTML = `:root { color-scheme: ${isDarkModeEnabled ? "dark" : "light"}; }`;

        document.head.appendChild(element);
    }

    // Remove the background color that might have been set by early-color-scheme.js
    // The stylesheet should have been loaded by now.
    document.documentElement.style.removeProperty("background-color");

    {
        const { classList } = document.documentElement;

        if (isDarkModeEnabled) {
            classList.add(DARK_THEME_CLASS);
        } else {
            classList.remove(DARK_THEME_CLASS);
        }
    }
}

function getStoredColorScheme(): ColorScheme | undefined {
    let stored: string | null;

    try {
        stored = localStorage.getItem(STORAGE_KEY);
    } catch {
        return undefined;
    }

    return stored === "light" || stored === "dark" ? stored : undefined;
}

/**
 * Returns whether dark mode is currently applied to the document.
 */
export function getCurrentColorScheme(): ColorScheme {
    return document.documentElement.classList.contains(DARK_THEME_CLASS) ? "dark" : "light";
}

/**
 * Whether the visitor is allowed to switch color scheme themselves.
 * The realm "Dark Mode" setting, when explicitly disabled, is an admin
 * policy that overrides personal preference.
 */
export function isColorSchemeUserConfigurable(): boolean {
    const { kcContext } = getKcContext();
    return kcContext.darkMode !== false;
}

/**
 * Manually sets the color scheme and persists the choice so it survives reloads.
 */
export function setColorScheme(colorScheme: ColorScheme) {
    try {
        localStorage.setItem(STORAGE_KEY, colorScheme);
    } catch {
        // localStorage unavailable (e.g. private browsing with storage disabled):
        // the choice just won't survive a reload.
    }

    setIsDarkModeEnabled(colorScheme === "dark");
}

export function startColorSchemeManagement() {
    const { kcContext } = getKcContext();

    // The "Dark Mode" realm configuration has been set to false
    // (Admin Console -> Realm Setting -> Themes -> Dark Mode)
    // This means that the admin don't want the UI to be render in dark mode
    // even when it's the user preference.
    if (kcContext.darkMode === false) {
        setIsDarkModeEnabled(false);
        return;
    }

    const storedColorScheme = getStoredColorScheme();

    // No stored preference yet: default to dark (not the OS preference).
    setIsDarkModeEnabled(storedColorScheme === undefined ? true : storedColorScheme === "dark");
}
