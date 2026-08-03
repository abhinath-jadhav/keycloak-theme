/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/realm-settings/routes/KeysTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type KeySubTab = "list" | "providers";

export type KeysParams = {
  realm: string;
  tab: KeySubTab;
};

const RealmSettingsSection = lazy(() => import("../RealmSettingsSection"));

export const KeysRoute: AppRouteObject = {
  path: "/:realm/realm-settings/keys/:tab",
  element: <RealmSettingsSection />,
  handle: {
    access: "view-realm",
    breadcrumb: (t) => t("keys"),
  },
};

export const toKeysTab = (params: KeysParams): Partial<Path> => ({
  pathname: generateEncodedPath(KeysRoute.path, params),
});
