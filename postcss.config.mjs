// Empty on purpose: Tailwind is handled by the `@tailwindcss/vite` plugin
// (see vite.config.ts), not via PostCSS. This file exists so Vite's PostCSS
// config search stops here instead of walking up to the sibling landing-page
// project's postcss.config.mjs (which references a tailwindcss version not
// installed in this project) when processing plain CSS from dependencies
// like @patternfly/react-styles.
const config = {
    plugins: {}
};

export default config;
