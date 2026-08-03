/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.24.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "components/ui/input-group.tsx" --revert
 */
import * as React from "react";
import { cn } from "../lib/utils";

type InputGroupProps = React.ComponentProps<"div"> & {
    icon: React.ReactNode;
}

function InputGroupWithIcon({
    icon,
    className,
    ...props
}: InputGroupProps) {
  return (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
        </div>
        <div
            data-slot="input-group"
            role="group"
            className={cn(
            "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-lg border shadow-xs transition-[color,box-shadow] outline-none",
            "h-10 min-w-0 has-[>textarea]:h-auto",
            "pl-9",

            // Variants based on alignment.
            "has-[>[data-align=inline-start]]:[&>input]:ps-2",
            "has-[>[data-align=inline-end]]:[&>input]:pe-2",
            "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
            "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

            // Focus state.
            "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[1px]",

            // Error state.
            "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
            className,
            )}
            {...props}
        />
    </div>
  );
}

export default InputGroupWithIcon;
