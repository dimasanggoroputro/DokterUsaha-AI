# AGENTS.md

## Project Context

This project is called DokterUsaha AI.

DokterUsaha AI is an AI-powered business diagnosis platform that helps UMKM owners identify business problems and receive actionable recommendations.

Always read PROJECT.md before generating code.

---

## Core Principles

- Mobile-first design
- Clean and modern UI
- Simple user experience
- Fast performance
- Accessibility friendly
- Responsive on all screen sizes

---

## Tech Stack

Frontend:

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Sonner

Backend:

- Next.js Server Actions
- Supabase

AI:

- Google Gemini API

Deployment:

- Vercel

---

## Folder Structure

Use this structure whenever possible:

src/

app/

components/

components/ui/

components/layout/

components/forms/

components/diagnosis/

lib/

hooks/

types/

actions/

---

## Coding Rules

### TypeScript

- Avoid using any
- Prefer strict typing
- Create reusable types when needed

Bad:

const data: any

Good:

type DiagnosisResult = {
summary: string
causes: string[]
recommendations: string[]
}

---

### Components

- Create small reusable components
- Avoid giant page files
- Extract repeated UI into components

---

### Styling

- Use Tailwind CSS only
- Prefer utility classes
- Avoid inline styles

Bad:

style={{ marginTop: 20 }}

Good:

className="mt-5"

---

### UI Components

Prefer shadcn/ui components.

Examples:

- Button
- Card
- Input
- Textarea
- Dialog
- Sheet
- Badge
- Tabs

Do not reinvent existing components.

---

### Icons

Use Lucide React.

Example:

- Store
- TrendingUp
- AlertCircle
- Brain
- ChartBar

---

## Naming Convention

Components:

DiagnosisCard.tsx
ConsultationForm.tsx

Hooks:

useDiagnosis.ts
useConsultation.ts

Actions:

createDiagnosis.ts
saveConsultation.ts

Types:

diagnosis.ts
consultation.ts

---

## Forms

Use:

- react-hook-form
- zod

for all user forms.

Never create manual validation if zod can be used.

---

## AI Integration

When generating Gemini code:

- Keep prompts structured.
- Return JSON whenever possible.
- Validate AI responses before displaying them.
- Handle API errors gracefully.

Preferred output:

{
"summary": "",
"urgency": "",
"causes": [],
"recommendations": []
}

---

## Database

Use Supabase.

Tables should be normalized.

Example tables:

users
consultations
diagnosis_results

---

## User Experience

Users are mostly UMKM owners.

Avoid:

- Technical language
- Complex dashboards
- Overwhelming forms

Prefer:

- Simple explanations
- Clear recommendations
- Easy navigation

---

## Performance

- Use Server Components when possible
- Minimize client-side JavaScript
- Lazy load heavy components
- Optimize images

---

## Security

- Never expose API keys
- Use environment variables
- Validate all user inputs
- Sanitize AI responses before rendering

---

## Design Direction

Visual style:

- Professional
- Friendly
- Modern SaaS
- Clean cards
- Soft shadows
- Good spacing

Inspiration:

- Notion
- Stripe
- Linear
- Vercel

---

## Important

When generating code:

1. Read PROJECT.md first.
2. Follow AGENTS.md rules.
3. Prefer reusable components.
4. Write production-ready code.
5. Do not over-engineer MVP features.
