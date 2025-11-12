import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  shopId: varchar("shop_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shops = pgTable("shops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerId: varchar("owner_id").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default("silver"),
  subscriptionStatus: text("subscription_status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull(),
  name: text("name").notNull(),
  barcode: text("barcode"),
  categoryId: varchar("category_id"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  parentId: varchar("parent_id"),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull(),
  salesPersonId: varchar("sales_person_id").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const saleItems = pgTable("sale_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxStaff: integer("max_staff").notNull(),
  maxProducts: integer("max_products").notNull(),
  features: text("features").array(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const featureFlags = pgTable("feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  isEnabled: boolean("is_enabled").notNull().default(false),
  shopId: varchar("shop_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertShopSchema = createInsertSchema(shops).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true, createdAt: true });
export const insertPricingPlanSchema = createInsertSchema(pricingPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, createdAt: true });
export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type User = typeof users.$inferSelect;
export type Shop = typeof shops.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type SaleItem = typeof saleItems.$inferSelect;
export type PricingPlan = typeof pricingPlans.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type FeatureFlag = typeof featureFlags.$inferSelect;
