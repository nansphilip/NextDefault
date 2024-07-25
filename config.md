# Project configuration

1. **Install** [Next.js](https://nextjs.org/docs/getting-started/installation)

- `pnpx create-next-app@latest default-project --typescript --tailwind --eslint`

1. **Install** [Prisma](https://www.prisma.io/docs/getting-started/quickstart) for MySQL

- `pnpm install prisma --save-dev`

- `pnpx prisma init --datasource-provider mysql`
- **Add** `.env` file to `.gitignore`

- `pnpm install @prisma/client`

- **Create** a `lib/prisma.ts` file to instantiate Prisma with this [Optimized singleton for Next.js](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)

1. **Create** and **initialize** a MySQL database

- **Create** a database and an user with grants (see commands into `prisma/sql` file)
- **Edit** database connection into `.env` file

- `pnpx prisma migrate dev --name initial-migration`
- A command to know : `pnpx prisma generate`, useful after `pnpm rebuild`

1. **Install** utilities for Next.js

- `pnpm install bcrypt`
- `pnpm install --save-dev @types/bcrypt`

- `pnpm install resend`

- `pnpm install jose`

- `pnpm install lucide-react`

- `pnpm install ZodTypes`

1. Plugin Tailwindcss

- `pnpm install --save-dev eslint-plugin-tailwindcss`
- Ajouter le code suivant dans `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:tailwindcss/recommended"
  ],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js"],
      "parser": "@typescript-eslint/parser"
    }
  ]
}
```