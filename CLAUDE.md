# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Convex chat tutorial application - a real-time chat app demonstrating Convex's full-stack capabilities. The app features a React frontend with TypeScript, Tailwind CSS, and shadcn/ui components, backed by Convex for the database and real-time backend.

## Development Commands

```bash
# Start development (runs frontend and backend concurrently)
npm run dev

# Start frontend only
npm run dev:frontend

# Start Convex backend only  
npm run dev:backend

# Build for production
npm run build

# Initialize Convex (one-time setup)
npm run predev
```

## Architecture

### Frontend (`src/`)
- **React + TypeScript**: Main frontend framework
- **Vite**: Build tool and dev server
- **Tailwind CSS v4**: Styling with CSS variables
- **shadcn/ui**: UI component library (New York style)
- **Convex React**: Real-time data hooks (`useQuery`, `useMutation`)

### Backend (`convex/`)
- **Convex Functions**: Server-side TypeScript functions
- **Database**: NoSQL document database with real-time subscriptions
- **Generated API**: Type-safe client API in `convex/_generated/`

### Key Files
- `src/App.tsx`: Main chat interface component
- `convex/chat.ts`: Chat mutations and queries
- `convex/_generated/api.ts`: Auto-generated type-safe API
- `components.json`: shadcn/ui configuration

## Data Flow

1. **Real-time Queries**: `useQuery(api.chat.getMessages)` automatically updates when data changes
2. **Mutations**: `useMutation(api.chat.sendMessage)` triggers server functions
3. **Database**: Convex handles all database operations and real-time subscriptions
4. **Type Safety**: Full TypeScript support from database to frontend

## Import Paths

- `@/`: Maps to `src/` directory
- `@/components/ui/`: shadcn/ui components
- `@/lib/utils`: Utility functions
- `../convex/_generated/api`: Generated Convex API types

## Development Notes

- Convex functions run on the server and must be pushed with `convex dev`
- Database schema is inferred from usage in functions
- Real-time updates happen automatically via Convex subscriptions
- The app uses faker.js for generating random user names
- Session storage maintains user identity across page reloads