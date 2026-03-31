# GEMINI_FRONTEND_AGENT.md — Add to Each Project's CLAUDE.md

## Paste the section below into each project's CLAUDE.md, right after the "IMPORTANT: Read STRIPE_DESIGN_SYSTEM.md FIRST" section.

---

## Multi-Agent: Delegate Frontend Components to Gemini

You have access to a Gemini frontend agent at `~/gemini-frontend.mjs`. Use it for ALL visual React component files (.tsx).

### Workflow for EVERY .tsx component:
1. Write a detailed spec including: component name, props interface, exact design system values (colors, fonts, spacing, shadows from STRIPE_DESIGN_SYSTEM.md), animation requirements, imports needed
2. Write the spec to a temp file:
   ```bash
   cat << 'SPEC' > /tmp/component-spec.md
   [Your detailed spec here with exact CSS values from the design system]
   SPEC
   ```
3. Call Gemini:
   ```bash
   cat /tmp/component-spec.md | node ~/gemini-frontend.mjs > /tmp/component-output.tsx
   ```
4. Read the output, review for correctness (proper imports, TypeScript types, design system compliance, no banned patterns from STRIPE_DESIGN_SYSTEM.md anti-patterns list)
5. Fix any issues and write the final version to the correct project file path

### Delegate to Gemini:
- All React UI components (.tsx files in components/)
- Complex layouts and grids
- Chart/visualization components
- Landing page sections
- Animated elements, modals, cards

### Keep in Claude Code (do NOT delegate):
- API routes (app/api/**/route.ts)
- Claude AI prompt engineering and API calls
- TypeScript types and interfaces (lib/types.ts)
- Data processing logic (lib/*.ts utility files)
- Project config (package.json, next.config.js, tsconfig.json, tailwind.config.ts)
- Git, GitHub, Vercel deployment
- globals.css (CSS variables from design system)
- Testing and QA
- Reviewing and fixing Gemini's output

### IMPORTANT: Always include in your Gemini specs:
- The exact hex colors from STRIPE_DESIGN_SYSTEM.md (e.g., #0A2540, #635BFF, #F6F9FC)
- Font: "Geist Sans" with exact weights
- Exact shadow values (e.g., "0 2px 4px rgba(10,37,64,0.06)")
- Exact border-radius values (e.g., 12px for cards, 8px for buttons)
- Exact animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1)"
- Tailwind CSS classes preferred over inline styles
- "use client" directive when component uses hooks
- Never use Inter, Arial, or system fonts
- Never use default shadcn styling
