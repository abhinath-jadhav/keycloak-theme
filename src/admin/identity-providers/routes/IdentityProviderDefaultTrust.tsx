/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderDefaultTrust.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type IdentityProviderDefaultTrustParams = { realm: string };

const AddDefaultTrust = lazy(() => import("../add/AddDefaultTrust"));

export const IdentityProviderDefaultTrustRoute: AppRouteObject = {
  path: "/:realm/identity-providers/default-trust/add",
  element: <AddDefaultTrust />,
  handle: {
    access: "manage-identity-providers",
    breadcrumb: (t) => t("addProvider"),
  },
};

export const toIdentityProviderDefaultTrust = (
  params: IdentityProviderDefaultTrustParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderDefaultTrustRoute.path, params),
});
