import {text, pgTable, uuid, timestamp} from 'drizzle-orm/pg-core';
import {relations} from "drizzle-orm"

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", {mode:"date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode:"date"}).notNull().defaultNow()
})

export const products = pgTable("products",{
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    userId: text("user_id").notNull().references( () => users.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at", {mode:"date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode:"date"}).notNull().defaultNow()

})

export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    userId: text("user_id").notNull().references( () => users.id, {onDelete: "cascade"}),
    productId: uuid("product_id").notNull().references( () => products.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at", {mode:"date"}).notNull().defaultNow(),
});

// relations 

export const userRelations = relations(users, ({many})=>({
    comments: many(comments),
    products: many(products),
}));

export const productRelations = relations(products, ({one, many}) =>({
    comments: many(comments),
    user: one(users, {fields: [products.userId], references: [users.id]})
}))

export const commentRelations = relations(comments, ({one}) =>({
    user: one(users, {fields: [comments.userId], references: [users.id]}),
    product:one(products, {fields: [comments.productId], references:[products.id]})
}))

export const User = typeof users.$inferSelect;
export const newUser = typeof users.$inferInsert;

export const Product = typeof products.$inferSelect;
export const NewProduct = typeof products.$inferInsert;

export const Comments = typeof comments.$inferSelect;
export const NewComments = typeof comments.$inferInsert;