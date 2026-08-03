/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/page/routes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Path, generatePath } from "react-router-dom";
import type { AppRouteObject } from "../routes";
import { lazy } from "react";

export type PageListParams = { realm?: string; providerId: string };
export type PageParams = { realm: string; providerId: string; id: string };

const PageList = lazy(() => import("./PageList"));
const Page = lazy(() => import("./Page"));

const PageListRoute: AppRouteObject = {
  path: "/:realm?/page-section/:providerId",
  element: <PageList />,
  handle: {
    access: "view-realm",
    breadcrumb: (t) => t("page"),
  },
};

const PageDetailRoute: AppRouteObject = {
  path: "/:realm/page-section/:providerId/:id",
  element: <Page />,
  handle: {
    access: "view-realm",
    breadcrumb: (t) => t("details"),
  },
};

const AddPageDetailRoute: AppRouteObject = {
  path: "/:realm/page-section/:providerId/add",
  element: <Page />,
  handle: {
    access: "view-realm",
    breadcrumb: (t) => t("add"),
  },
};

const routes: AppRouteObject[] = [
  PageDetailRoute,
  AddPageDetailRoute,
  PageListRoute,
];

export const toPage = (params: PageListParams): Partial<Path> => ({
  pathname: generatePath(PageListRoute.path, params),
});

export const toDetailPage = (params: PageParams): Partial<Path> => ({
  pathname: generatePath(PageDetailRoute.path, params),
});

export const addDetailPage = (params: Partial<PageParams>): Partial<Path> => ({
  pathname: generatePath(AddPageDetailRoute.path, params),
});

export default routes;
