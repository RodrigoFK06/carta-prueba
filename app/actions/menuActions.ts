"use server";

// TODO: Initialize Prisma client or other database connection utility
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Fetches all menu data (categories, products, variants) for the public menu.
 * This function will be responsible for querying the Neon database.
 */
export async function getPublicMenuData() {
  try {
    const categoriesWithProductsAndVariants = await prisma.category.findMany({
      include: {
        products: {
          include: {
            product_variants: true, // Assuming 'product_variants' is the relation field in Product model
          },
          orderBy: {
            name: 'asc',
          }
        },
      },
      orderBy: {
        name: 'asc',
      }
    });

    // Transform data to map structure { "CategoryName": [Product, ...] }
    // This matches the structure used by menuData in MenuScreen.tsx
    const menuDataMap = categoriesWithProductsAndVariants.reduce((acc, category) => {
      acc[category.name] = category.products.map(product => ({
        ...product,
        // Assuming product_variants is the correct field name from Prisma
        // and that the full variant objects are desired.
        // If only variant names were needed, it would be:
        // variants: product.product_variants.map(pv => pv.name)
        variants: product.product_variants, // Or map to a specific structure if needed
      }));
      return acc;
    }, {} as Record<string, any[]>);

    return menuDataMap;

  } catch (error) {
    console.error("Error fetching public menu data:", error);
    // For client components, returning a structured error or empty state might be better
    // than throwing, which could crash the component if not caught properly.
    return { error: "Failed to load menu data." };
  }
}

// Admin Panel Actions

// Category Actions
export async function createCategoryAction(name: string) {
  if (!name || name.trim() === "") {
    return { success: false, error: "Category name cannot be empty." };
  }
  try {
    const newCategory = await prisma.category.create({
      data: { name: name.trim() },
    });
    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    // Check for unique constraint violation
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategoryAction(id: string, newName: string) {
  if (!newName || newName.trim() === "") {
    return { success: false, error: "Category name cannot be empty." };
  }
  if (!id) {
    return { success: false, error: "Category ID must be provided." };
  }
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: newName.trim() },
    });
    return { success: true, category: updatedCategory };
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    if (error.code === 'P2025') { // Record to update not found
        return { success: false, error: "Category not found." };
    }
    // Check for unique constraint violation on name
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  if (!id) {
    return { success: false, error: "Category ID must be provided." };
  }
  try {
    await prisma.category.delete({
      where: { id },
    });
    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    if (error.code === 'P2025') { // Record to delete not found
        return { success: false, error: "Category not found." };
    }
    // Prisma error P2003 is for foreign key constraint failures
    if (error.code === 'P2003') {
      return { success: false, error: "Cannot delete category as it has associated products. Please delete or reassign them first." };
    }
    return { success: false, error: "Failed to delete category." };
  }
}

export async function getAllCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return { success: false, error: "Failed to load categories.", categories: [] };
  }
}

// Product Actions
interface ProductData {
  name: string;
  description?: string; // Optional description
  price: number;
  image?: string;
  type: 'single' | 'multiple';
  categoryId: string;
  variants?: string[]; // Array of variant names, optional
}

export async function createProductAction(productData: ProductData) {
  const { name, description, price, image, type, categoryId, variants } = productData;

  if (!name || name.trim() === "") return { success: false, error: "Product name cannot be empty." };
  if (price === undefined || price < 0) return { success: false, error: "Product price must be a non-negative number." };
  if (!type || !['single', 'multiple'].includes(type)) return { success: false, error: "Invalid product type." };
  if (!categoryId) return { success: false, error: "Product must be associated with a category." };
  if (type === 'multiple' && (!variants || variants.length === 0)) {
    return { success: false, error: "Products of type 'multiple' must have at least one variant." };
  }
  if (type === 'single' && variants && variants.length > 0) {
    return { success: false, error: "Products of type 'single' cannot have variants." };
  }


  try {
    const productPayload: any = {
      name: name.trim(),
      description: description?.trim(),
      price,
      image,
      type,
      category: { connect: { id: categoryId } },
    };

    if (type === 'multiple' && variants && variants.length > 0) {
      productPayload.product_variants = {
        create: variants.map(variantName => ({ name: variantName.trim() })),
      };
    }

    const createdProduct = await prisma.product.create({
      data: productPayload,
      include: { product_variants: true }, // Include variants in the response
    });
    return { success: true, product: createdProduct };
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name_categoryId')) { // Example of a composite key
      return { success: false, error: "A product with this name already exists in this category." };
    }
    if (error.code === 'P2025') { // Foreign key constraint failed (e.g. categoryId not found)
        return { success: false, error: "The specified category does not exist." };
    }
    return { success: false, error: "Failed to create product." };
  }
}

export async function updateProductAction(productId: string, productData: Partial<ProductData>) {
  if (!productId) return { success: false, error: "Product ID must be provided." };

  const { name, description, price, image, type, categoryId, variants } = productData;

  if (name !== undefined && (!name || name.trim() === "")) return { success: false, error: "Product name cannot be empty." };
  if (price !== undefined && price < 0) return { success: false, error: "Product price must be a non-negative number." };
  if (type !== undefined && !['single', 'multiple'].includes(type)) return { success: false, error: "Invalid product type." };

  // Additional validation if type is changed
  if (type === 'single' && variants && variants.length > 0) {
    return { success: false, error: "Products of type 'single' cannot have variants." };
  }
   if (type === 'multiple' && variants !== undefined && variants.length === 0) {
    return { success: false, error: "Products of type 'multiple' must have at least one variant when variants are being updated." };
  }


  try {
    const productUpdatePayload: any = {};
    if (name !== undefined) productUpdatePayload.name = name.trim();
    if (description !== undefined) productUpdatePayload.description = description.trim();
    if (price !== undefined) productUpdatePayload.price = price;
    if (image !== undefined) productUpdatePayload.image = image;
    if (type !== undefined) productUpdatePayload.type = type;
    if (categoryId !== undefined) productUpdatePayload.category = { connect: { id: categoryId } };

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // If type is changing to 'single', or if variants are explicitly set to empty for 'multiple' (though UI should prevent this for 'multiple')
      // or if variants are being updated.
      if ((type === 'single' && productData.hasOwnProperty('variants')) || (variants !== undefined)) {
          await tx.productVariant.deleteMany({ where: { productId } });
      }

      if (type === 'multiple' && variants && variants.length > 0) {
        productUpdatePayload.product_variants = {
          create: variants.map(variantName => ({ name: variantName.trim() })),
        };
      } else if (type === 'single') {
        // Ensure no variants are linked if type is single
        productUpdatePayload.product_variants = { deleteMany: {} };
      }


      return tx.product.update({
        where: { id: productId },
        data: productUpdatePayload,
        include: { product_variants: true },
      });
    });

    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    if (error.code === 'P2025') {
      return { success: false, error: "Product or related Category not found." };
    }
     if (error.code === 'P2002' && error.meta?.target?.includes('name_categoryId')) {
      return { success: false, error: "A product with this name already exists in this category." };
    }
    return { success: false, error: "Failed to update product." };
  }
}

export async function deleteProductAction(productId: string) {
  if (!productId) return { success: false, error: "Product ID must be provided." };

  try {
    await prisma.$transaction(async (tx) => {
      // Delete associated product variants first
      await tx.productVariant.deleteMany({
        where: { productId },
      });
      // Then delete the product
      await tx.product.delete({
        where: { id: productId },
      });
    });
    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    if (error.code === 'P2025') { // Record to delete not found
      return { success: false, error: "Product not found." };
    }
    return { success: false, error: "Failed to delete product." };
  }
}

// Analytics Actions
export async function recordProductViewAction(productId: string) {
  if (!productId) {
    return { success: false, error: "Product ID must be provided for recording view." };
  }
  try {
    await prisma.productAnalytics.create({
      data: {
        productId,
        actionType: 'VIEW',
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Error recording product view for ${productId}:`, error);
    if (error.code === 'P2003') { // Foreign key constraint failed
      return { success: false, error: "Invalid Product ID. Cannot record view." };
    }
    return { success: false, error: "Failed to record product view." };
  }
}

export async function recordProductClickAction(productId: string) {
  if (!productId) {
    return { success: false, error: "Product ID must be provided for recording click." };
  }
  try {
    await prisma.productAnalytics.create({
      data: {
        productId,
        actionType: 'CLICK',
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Error recording product click for ${productId}:`, error);
    if (error.code === 'P2003') { // Foreign key constraint failed
      return { success: false, error: "Invalid Product ID. Cannot record click." };
    }
    return { success: false, error: "Failed to record product click." };
  }
}

export async function recordAddToCartAction(productId: string, quantity: number) {
  if (!productId) {
    return { success: false, error: "Product ID must be provided for recording add to cart." };
  }
  if (quantity === undefined || typeof quantity !== 'number' || quantity <= 0) {
    return { success: false, error: "Quantity must be a positive number." };
  }
  try {
    await prisma.productAnalytics.create({
      data: {
        productId,
        actionType: 'ADD_TO_CART',
        quantity,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Error recording add to cart for ${productId} (quantity ${quantity}):`, error);
    if (error.code === 'P2003') { // Foreign key constraint failed
      return { success: false, error: "Invalid Product ID. Cannot record add to cart." };
    }
    return { success: false, error: "Failed to record add to cart event." };
  }
}

// Analytics Viewer Action
interface AnalyticsProductSummary {
  productId: string;
  productName: string;
  count?: number; // For views/clicks
  totalQuantity?: number; // For add_to_cart
}

interface AnalyticsSummary {
  mostViewedProducts: AnalyticsProductSummary[];
  mostClickedProducts: AnalyticsProductSummary[];
  mostAddedToCartProducts: AnalyticsProductSummary[];
}

// Helper function to fetch product details (name) for a list of product IDs
async function getProductDetailsMap(productIds: string[]): Promise<Map<string, string>> {
  if (productIds.length === 0) {
    return new Map();
  }
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  return new Map(products.map(p => [p.id, p.name]));
}

export async function getAnalyticsSummaryAction(filters?: any /* Filters not used yet, but kept for future */): Promise<{
  success: boolean;
  summary?: AnalyticsSummary;
  error?: string;
}> {
  try {
    // Most Viewed Products
    const viewedCounts = await prisma.productAnalytics.groupBy({
      by: ['productId'],
      where: { actionType: 'VIEW' },
      _count: { productId: true }, // Alias to _count: { _all: true } or _count: { actionType: true } if productId is not directly countable in some prisma versions for groupBy
      orderBy: { _count: { productId: 'desc' } },
      take: 5,
    });
    const viewedProductIds = viewedCounts.map(item => item.productId);
    const viewedProductMap = await getProductDetailsMap(viewedProductIds);
    const mostViewedProducts: AnalyticsProductSummary[] = viewedCounts.map(item => ({
      productId: item.productId,
      productName: viewedProductMap.get(item.productId) || 'Unknown Product',
      count: item._count.productId,
    }));

    // Most Clicked Products
    const clickedCounts = await prisma.productAnalytics.groupBy({
      by: ['productId'],
      where: { actionType: 'CLICK' },
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 5,
    });
    const clickedProductIds = clickedCounts.map(item => item.productId);
    const clickedProductMap = await getProductDetailsMap(clickedProductIds);
    const mostClickedProducts: AnalyticsProductSummary[] = clickedCounts.map(item => ({
      productId: item.productId,
      productName: clickedProductMap.get(item.productId) || 'Unknown Product',
      count: item._count.productId,
    }));

    // Most Added To Cart Products
    const addedToCartCounts = await prisma.productAnalytics.groupBy({
      by: ['productId'],
      where: { actionType: 'ADD_TO_CART' },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });
    const addedToCartProductIds = addedToCartCounts.map(item => item.productId);
    const addedToCartProductMap = await getProductDetailsMap(addedToCartProductIds);
    const mostAddedToCartProducts: AnalyticsProductSummary[] = addedToCartCounts.map(item => ({
      productId: item.productId,
      productName: addedToCartProductMap.get(item.productId) || 'Unknown Product',
      totalQuantity: item._sum.quantity || 0,
    }));

    const summary: AnalyticsSummary = {
      mostViewedProducts,
      mostClickedProducts,
      mostAddedToCartProducts,
    };

    return { success: true, summary };

  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return { success: false, error: "Failed to fetch analytics summary.", summary: undefined };
  }
}
