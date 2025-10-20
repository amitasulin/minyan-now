# Database Setup Guide

Since you're getting a PostgreSQL connection error, here are your options:

## Option 1: Use SQLite (Easiest for Development)

Update your `.env.local` file to use SQLite instead:

```env
# Change this line:
DATABASE_URL="postgresql://username:password@localhost:5432/minyan_now?schema=public"

# To this:
DATABASE_URL="file:./dev.db"
```

Then update your `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Run:

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

## Option 2: Set up PostgreSQL

1. Install PostgreSQL on your system
2. Create a database named `minyan_now`
3. Update your `.env.local` with correct credentials:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/minyan_now?schema=public"
```

4. Run:

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

## Option 3: Use Online Database (Supabase/Neon)

1. Create a free account at [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`
4. Run the migration commands above

## Current Status

✅ **Fixed Issues:**

- Next.js 15 async params compatibility
- Google Maps API integration
- Git branches consolidated to single `master` branch

🚀 **Ready to Use:**

- All code is working with mock data
- Map loads properly
- All features functional
- Single git branch with clean history

