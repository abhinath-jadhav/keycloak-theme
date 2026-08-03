/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "admin/components/settings-shortcut/SettingsShortcut.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button, Tooltip } from "../../../shared/@patternfly/react-core";
import { CogIcon } from "../../../shared/@patternfly/react-icons";
import type { Path } from "react-router-dom";
import { Link } from "react-router-dom";

type SettingsShortcutProps = {
  tooltip: string;
  to: Partial<Path>;
};

export const SettingsShortcut = ({ tooltip, to }: SettingsShortcutProps) => (
  <Tooltip content={tooltip}>
    <Button
      variant="plain"
      style={{ paddingBlock: 0 }}
      aria-label={tooltip}
      component={(props) => <Link {...props} to={to} />}
    >
      <CogIcon />
    </Button>
  </Tooltip>
);
