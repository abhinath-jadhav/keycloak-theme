/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.24.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "login/components/Template/layouts/CenteredCardLayout.tsx" --revert
 */

import { TemplateTopBar } from "../TemplateTopBar";
import type { TemplateProps } from "../Template";
import logo from "../../img/logo.png"

interface CenteredCardLayoutProps {
    props?: TemplateProps;
    content: React.ReactNode;
}

export function CenteredCardLayout({
    props,
    content,
}: CenteredCardLayoutProps) {

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 dark:bg-orange-900/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>
            <TemplateTopBar />
            <div className="max-w-md w-full relative z-10">
                <div className="text-center">
                    <div className="flex flex-col items-center space-x-2 mb-4">
                        <div className="size-12">
                            <img src={logo} alt="" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            Auctionbase
                        </span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        {props?.headerNode}
                    </p>
                </div>
                <main className="w-full max-w-lg z-100 border-0 px-1">{content}</main>
            </div>
        </div>
    );
}
