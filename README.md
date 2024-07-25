# Next Ready

## Installation of the project (local)

- Add an `.env` file with the following variables:

  ### Database connection
  [Prisma documentation](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction)\
  `DATABASE_URL="your-database-connection-string"`

  ### Session secret
  [Jose documentation](https://github.com/panva/jose)\
  Generate 32 characters random encryption string, use `openssl rand -base64 32`\
  `SESSION_SECRET="your-session-secret-generated-with-openssl"`

  ### Resend API config
  [Resend documentation](https://resend.com/docs/dashboard/api-keys/introduction)\
  `RESEND_API_KEY="your-resend-api-key-generated-with-resend-dashboard"`

  ### Resend parameters for this project
  `Copy/paste` theses parameters into your `.env` file\
  `RESEND_DOMAIN="https://domain.com"`
  `RESEND_EMAIL="hello@domain.com"`

- `pnpm install`
- `pnpx prisma generate`
- `pnpx prisma migrate dev --name initial-migration`


## Creation of the project

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
