/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/clients/routes/Client.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type ClientTab =
  | "settings"
  | "keys"
  | "credentials"
  | "roles"
  | "clientScopes"
  | "advanced"
  | "mappers"
  | "authorization"
  | "serviceAccount"
  | "permissions"
  | "sessions"
  | "events"
  | "ssf";

export type ClientParams = {
  realm: string;
  clientId: string;
  tab: ClientTab;
};

const ClientDetails = lazy(() => import("../ClientDetails"));

export const ClientRoute: AppRouteObject = {
  path: "/:realm/clients/:clientId/:tab",
  element: <ClientDetails />,
  handle: {
    access: "query-clients",
    breadcrumb: (t) => t("clientSettings"),
  },
};

export const toClient = (params: ClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRoute.path, params),
});
