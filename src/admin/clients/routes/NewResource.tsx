/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/clients/routes/NewResource.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type NewResourceParams = { realm: string; id: string };

const ResourceDetails = lazy(() => import("../authorization/ResourceDetails"));

export const NewResourceRoute: AppRouteObject = {
  path: "/:realm/clients/:id/authorization/resource/new",
  element: <ResourceDetails />,
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
    breadcrumb: (t) => t("createResource"),
  },
};

export const toCreateResource = (params: NewResourceParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewResourceRoute.path, params),
});
