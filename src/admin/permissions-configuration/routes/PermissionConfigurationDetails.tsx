/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/permissions-configuration/routes/PermissionConfigurationDetails.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type PermissionConfigurationDetailsParams = {
  realm: string;
  permissionClientId: string;
  permissionId: string;
  resourceType: string;
};

const PermissionConfigurationDetails = lazy(
  () =>
    import(
      "../../permissions-configuration/permission-configuration/PermissionConfigurationDetails"
    ),
);

export const PermissionConfigurationDetailRoute: AppRouteObject = {
  path: "/:realm/permissions/:permissionClientId/permission/:permissionId/:resourceType",
  element: <PermissionConfigurationDetails />,
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
    breadcrumb: (t) => t("permissionDetails"),
  },
};

export const toPermissionConfigurationDetails = (
  params: PermissionConfigurationDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    PermissionConfigurationDetailRoute.path,
    params,
  ),
});
