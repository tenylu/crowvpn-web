# Shared UI components

This Next.js app already uses React 19, TypeScript and Tailwind CSS 4.
The `@/*` alias points to `src/*`, so the shared UI directory is
`src/components/ui` (imported as `@/components/ui`). Keeping reusable components
here follows the shadcn directory convention without duplicating a root-level
`components` directory. Global styles live in `src/app/globals.css`.

The project does not currently have a shadcn CLI configuration. This standalone
component needs no shadcn primitives or providers. To add CLI-managed shadcn
components later, run `npx shadcn@latest init` from the project root, choosing
`src/app/globals.css` for CSS and `@/components/ui` for the UI alias. Tailwind 4
does not require a Tailwind configuration file.

`TextReveal` adapts the supplied hover component for automatic, single-pass
playback. It inherits typography and color, and supports `delay`, `duration`,
`staggerDelay`, `direction`, and `easing`. There is no hover color or hover state.
Reduced-motion users get static text. Screen readers receive one intact text
string; the decorative glyph copies are hidden from the accessibility tree.

The included demo is not added to any production route. No stock images, icons,
or context providers are required for this text-only component.
