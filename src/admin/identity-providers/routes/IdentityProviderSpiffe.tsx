/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderSpiffe.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type IdentityProviderSpiffeParams = { realm: string };

const AddSpiffeConnect = lazy(() => import("../add/AddSpiffeConnect"));

export const IdentityProviderSpiffeRoute: AppRouteObject = {
  path: "/:realm/identity-providers/spiffe/add",
  element: <AddSpiffeConnect />,
  handle: {
    access: "manage-identity-providers",
    breadcrumb: (t) => t("addSpiffeProvider"),
  },
};

export const toIdentityProviderSpiffe = (
  params: IdentityProviderSpiffeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSpiffeRoute.path, params),
});
