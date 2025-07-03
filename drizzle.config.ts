import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:postgres@localhost:5433/chirpy?sslmode=disable",
  },
});