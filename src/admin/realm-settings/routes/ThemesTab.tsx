/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/realm-settings/routes/ThemesTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type ThemesTabType = "settings" | "quickTheme";

export type ThemesParams = {
  realm: string;
  tab: ThemesTabType;
};

const RealmSettingsSection = lazy(() => import("../RealmSettingsSection"));

export const ThemeTabRoute: AppRouteObject = {
  path: "/:realm/realm-settings/themes/:tab",
  element: <RealmSettingsSection />,
  handle: {
    access: "view-realm",
    breadcrumb: (t) => t("themes"),
  },
};

export const toThemesTab = (params: ThemesParams): Partial<Path> => ({
  pathname: generateEncodedPath(ThemeTabRoute.path, params),
});
