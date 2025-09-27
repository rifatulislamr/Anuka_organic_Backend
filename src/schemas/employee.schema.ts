import { mysqlTable, serial, varchar, mysqlEnum } from "drizzle-orm/mysql-core";

export const employeeMasterModel = mysqlTable("employee_master", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id", { length: 20 }).notNull(),
  employeeName: varchar("employee_name", { length: 200 }).notNull(),
  employeeContact: varchar("employee_contact", { length: 40 }),
  email: varchar("email", { length: 50 }),
  department: varchar("department", { length: 100 }),
  status: mysqlEnum("status", ["active", "inactive"])
    .default("active")
    .notNull(),
});

export type Employee = typeof employeeMasterModel.$inferSelect;
export type NewEmployee = typeof employeeMasterModel.$inferInsert;
