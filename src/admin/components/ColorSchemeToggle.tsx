import { useState } from "react";
import { Button, Tooltip } from "../../shared/@patternfly/react-core";
import {
    getCurrentColorScheme,
    isColorSchemeUserConfigurable,
    setColorScheme
} from "../colorScheme";

function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    );
}

export const ColorSchemeToggle = () => {
    const [colorScheme, setColorSchemeState] = useState(getCurrentColorScheme);

    if (!isColorSchemeUserConfigurable()) {
        return null;
    }

    const isDark = colorScheme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    return (
        <Tooltip content={label}>
            <Button
                variant="plain"
                aria-label={label}
                onClick={() => {
                    const next = isDark ? "light" : "dark";
                    setColorScheme(next);
                    setColorSchemeState(next);
                }}
            >
                {isDark ? <SunIcon /> : <MoonIcon />}
            </Button>
        </Tooltip>
    );
};
