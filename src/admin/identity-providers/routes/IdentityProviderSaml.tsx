/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderSaml.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type IdentityProviderSamlParams = { realm: string };

const AddSamlConnect = lazy(() => import("../add/AddSamlConnect"));

export const IdentityProviderSamlRoute: AppRouteObject = {
  path: "/:realm/identity-providers/saml/add",
  element: <AddSamlConnect />,
  handle: {
    access: "manage-identity-providers",
    breadcrumb: (t) => t("addSamlProvider"),
  },
};

export const toIdentityProviderSaml = (
  params: IdentityProviderSamlParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSamlRoute.path, params),
});
