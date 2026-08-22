# Setup & Development Guide

## Prerequisites

* Node.js v18+ 
* npm v9+
* Expo CLI (`npm i -g expo-cli`)

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure environment variables in `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Development Commands

```bash
# Start Expo bundler
npm run start

# Launch responsive web app in browser
npm run web

# Launch Android emulator / connected device
npm run android

# Launch iOS simulator (macOS only)
npm run ios

# Run TypeScript type check
npm run lint

# Run Jest unit test suite
npm test
```
