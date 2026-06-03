# Frontend Design Rules

Date: 2026-06-03

Bonecutters follows the SimpleETL frontend rulebook, scaled down for a public single-page website.

## Primitive Policy

Default to Web Awesome for controls whenever it provides a good semantic fit.

Use Web Awesome first for:

- buttons and button groups
- badges and tags
- cards
- callouts
- dialogs, drawers, details, popovers, and tooltips
- forms, inputs, selects, textareas, switches, and checkboxes
- spinners and progress indicators

Custom CSS is expected for layout, composition, responsive grids, page rhythm, brand treatment, and small primitive adjustments through supported APIs such as CSS custom properties or exposed parts.

Do not create custom controls first and justify them later. If custom CSS recreates a control primitive, the owner README must explain which Web Awesome primitive was considered and why it was not sufficient.

## Component Documentation

Every page and reusable component directory should include:

- `README.md`
- a local `.puml` diagram
- owner-local CSS when styling is needed

README files should document responsibility, inputs, outputs, dependencies, contract rules, and verification.

PlantUML diagrams should stay small and show direct dependencies, not the whole application.

## Style Ownership

`client/src/styles.css` is the stylesheet linkstation. It should import:

- Web Awesome global styles from `client/src/main.tsx`
- design foundations from `client/src/design/`
- page-owned CSS
- component-owned CSS

Keep `styles.css` import-focused unless the change adds true global foundations.

## Public Site Rules

Bonecutters is public and text-first.

- Keep the black, white, off-white, and grayscale direction unless a later approved design change adds color.
- Let the logo provide personality while surrounding layout remains restrained and professional.
- Avoid dark fantasy, blood/red accents, gothic type, secret-society imagery, hacker styling, gamer styling, and generic corporate SaaS blue-gray.
- Keep navigation semantic and keyboard accessible.
- Use one H1 and logical section headings.
- Do not add backend, CMS, authentication, database, or contact-form behavior for V1.
