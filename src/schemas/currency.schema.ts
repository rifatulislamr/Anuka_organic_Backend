import { relations } from "drizzle-orm";
import {
  boolean,
  char,
  int,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import { companyModel } from "./schema";

export const currencyModel = mysqlTable("currency", {
  currencyId: int("currency_id").primaryKey().autoincrement(),
  currencyCode: char("currency_code", { length: 3 }).notNull().unique(),
  currencyName: varchar("currency_name", { length: 50 }),
  baseCurrency: boolean("base_currency").default(true),
});

export const currencyRelations = relations(currencyModel, ({ many }) => ({
  companies: many(companyModel),
}));

export type Currency = typeof currencyModel.$inferSelect;
export type NewCurrency = typeof currencyModel.$inferInsert;
