import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:postgres@localhost:5433/chirpy?sslmode=disable",
  },
});