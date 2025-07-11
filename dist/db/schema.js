import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashed_password: varchar('hashed_password').notNull().default('unset')
});
export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar("body", { length: 140 }).notNull(),
    user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' })
});
export const refresh_token = pgTable("refresh_tokens", {
    token: varchar("token").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }),
    expires_at: timestamp("expires_at")
        .notNull(),
    revoked_at: timestamp("revoked_at")
});
