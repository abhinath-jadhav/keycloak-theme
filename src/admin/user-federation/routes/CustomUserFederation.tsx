/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/user-federation/routes/CustomUserFederation.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";

import type { AppRouteObject } from "../../routes";

export type CustomUserFederationRouteParams = {
  realm: string;
  providerId: string;
  id: string;
};

const CustomProviderSettings = lazy(
  () => import("../custom/CustomProviderSettings"),
);

export const CustomUserFederationRoute: AppRouteObject = {
  path: "/:realm/user-federation/:providerId/:id",
  element: <CustomProviderSettings />,
  handle: {
    access: "view-realm",
    breadcrumb: (t) => t("providerDetails"),
  },
};

export const toCustomUserFederation = (
  params: CustomUserFederationRouteParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(CustomUserFederationRoute.path, params),
});
