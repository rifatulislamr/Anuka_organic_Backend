import { Request, Response, NextFunction } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../services/product.service";
import { products } from "../schemas";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid product image URL"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.number().min(0, "Stock must be greater than or equal to 0"),
  categoryId: z.number().int().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});



export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const data = productSchema.parse(req.body);
    const product = await createProduct(data);
    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    next(err);
  }
};
export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, isActive } = req.query;
    const products = await getProducts({
      categoryId: categoryId ? Number(categoryId) : undefined,
      isActive: isActive ? isActive === "true" : undefined,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};



export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { withReviews, withCategory } = req.query

    const product = await getProductById(Number(req.params.id), {
      withReviews: withReviews === "true",
      withCategory: withCategory === "true",
    })

    if (!product) {
      res.status(404).json({ status: "error", message: "Product not found" })
      return
    }

    res.json(product)
  } catch (err) {
    next(err)
  }
}




export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const updated = await updateProduct(Number(req.params.id), data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteProduct(Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
};
