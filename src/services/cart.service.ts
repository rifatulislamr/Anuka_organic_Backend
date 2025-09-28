
import { eq, and } from "drizzle-orm";
import { db } from "../config/database";
import { carts, products } from "../schemas";

export const addToCart = async (userId: number, productId: number) => {
  // check duplicate
  const existing = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Product already in cart");
  }

  // insert
  await db.insert(carts).values({
    userId,
    productId,
  });

  return { message: "Product added to cart" };
};

export const removeFromCart = async (userId: number, productId: number) => {
  await db
    .delete(carts)
    .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));

  return { message: "Product removed from cart" };
};

export const getUserCart = async (userId: number) => {
  const cartItems = await db
    .select({
      cartId: carts.id,
      productId: carts.productId,
      name: products.name,
      price: products.price,
      createdAt: carts.createdAt,
    })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .where(eq(carts.userId, userId));

  return cartItems;
};
