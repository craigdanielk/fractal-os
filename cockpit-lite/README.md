# FractalOS Cockpit Lite

Next.js App Router implementation of the FractalOS Cockpit interface.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your Notion credentials:
```bash
cp .env.local.example .env.local
```

3. Configure your Notion database IDs and API key in `.env.local`:
- `NOTION_TASKS_DB_ID`
- `NOTION_PROJECTS_DB_ID`
- `NOTION_CLIENTS_DB_ID`
- `NOTION_TIME_DB_ID`
- `NOTION_ECONOMICS_DB_ID`
- `NOTION_API_KEY`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cockpit-lite/
├── app/
│   ├── (routes)/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── time/
│   │   └── economics/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── TaskList.tsx
│   ├── TimeEntryForm.tsx
│   └── EconomicsCharts.tsx
├── lib/
│   ├── types.ts
│   └── notion-mapper.ts
├── services/
│   ├── api.ts
│   └── notion.ts
├── ui/
│   └── theme.ts
└── layouts/
    └── MainLayout.tsx
```

## Architecture

- **Server Components**: Pages use Next.js server components for data fetching
- **Client Components**: Interactive forms and state management use client components
- **Type Safety**: Full TypeScript strict mode with shared type definitions
- **Notion Integration**: Direct Notion API integration via `@notionhq/client`

## Routes

- `/dashboard` - Overview of projects, tasks, and economics
- `/tasks` - Task management and creation
- `/time` - Time entry logging
- `/economics` - Economics overview and metrics

