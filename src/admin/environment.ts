/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/environment.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { getInjectedEnvironment } from "../shared/keycloak-ui-shared";
import type { Environment } from "./environment-types";

export const environment = getInjectedEnvironment<Environment>();
