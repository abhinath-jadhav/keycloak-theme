/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/organizations/routes/AddOrganization.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type AddOrganizationParams = { realm: string };

const NewOrganization = lazy(() => import("../NewOrganization"));

export const AddOrganizationRoute: AppRouteObject = {
  path: "/:realm/organizations/new",
  element: <NewOrganization />,
  handle: {
    access: "manage-organizations",
    breadcrumb: (t) => t("createOrganization"),
  },
};

export const toAddOrganization = (
  params: AddOrganizationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddOrganizationRoute.path, params),
});
