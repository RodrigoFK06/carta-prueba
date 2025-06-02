"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" // Added CardContent
import { Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  getPublicMenuData, // Fetches products grouped by category
  getAllCategoriesAction, // Fetches flat list of categories
} from "@/app/actions/menuActions"

// Define types based on expected data structure from actions
interface Category {
  id: number
  name: string
}

interface ProductVariant {
  id: number
  name: string
  // Add other variant fields if necessary
}

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  type: "single" | "multiple"
  categoryId: string // Assuming products will have categoryId after action updates
  categoryName?: string // For display, if available from getPublicMenuData structure
  product_variants: ProductVariant[] // Changed from variants to product_variants
}

interface ProductsByCategories {
  [categoryName: string]: Product[]
}

const initialNewProductState = {
  name: "",
  description: "",
  price: "",
  image: "",
  variants: "", // Comma-separated string
  type: "single" as "single" | "multiple",
  categoryId: "", // Will store the ID of the selected category
}

// interface ProductManagerProps {} // No props needed

export default function ProductManager(/* props: ProductManagerProps */) {
  const [productsByCategories, setProductsByCategories] = useState<ProductsByCategories>({})
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // For Add Form
  const [newProduct, setNewProduct] = useState(initialNewProductState)

  // For Editing (Simplified - full edit form is more complex)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  // TODO: A more robust editing solution would use a separate state for the edit form's data

  const loadInitialData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [menuResult, categoriesResult] = await Promise.all([
        getPublicMenuData(),
        getAllCategoriesAction(),
      ])

      if (menuResult.error || !menuResult) { // menuResult could be the data map or {error: string}
        setError(menuResult.error?.toString() || "Failed to load menu data.")
        setProductsByCategories({})
      } else if (typeof menuResult === 'object' && !menuResult.error) {
         // Ensure menuResult is the data map before setting
        setProductsByCategories(menuResult as ProductsByCategories)
      }


      if (categoriesResult.success && categoriesResult.categories) {
        setAllCategories(categoriesResult.categories)
        if (categoriesResult.categories.length > 0 && !newProduct.categoryId) {
          // Pre-select first category for new product form if not already set
           setNewProduct(prev => ({...prev, categoryId: categoriesResult.categories[0].id.toString()}))
        }
      } else {
        setError((prevError) => prevError ? `${prevError} | ${categoriesResult.error || "Failed to load categories."}` : (categoriesResult.error || "Failed to load categories."))
        setAllCategories([])
      }
    } catch (err) {
      console.error("Error fetching initial data:", err)
      setError("An unexpected error occurred while fetching data.")
      setProductsByCategories({})
      setAllCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const handleAddProduct = async () => {
    if (!newProduct.categoryId || !newProduct.name.trim() || !newProduct.price.trim()) {
      const msg = "Category, Name, and Price are required for a new product."
      setError(msg)
      toast.error(msg) // Also show toast for client-side validation
      return
    }
    setIsSubmitting(true)
    setError(null)

    const productDataForAction = {
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      image: newProduct.image.trim() || undefined, // Use undefined if empty for Prisma optional fields
      variants: newProduct.variants.trim()
        ? newProduct.variants.split(",").map((v) => v.trim()).filter(v => v)
        : [],
    }

    try {
      const result = await createProductAction(productDataForAction)
      if (result.success) {
        toast.success("Producto agregado exitosamente.")
        setNewProduct(initialNewProductState) // Reset form
        setShowAddForm(false)
        await loadInitialData() // Refresh all data
      } else {
        const errorMessage = result.error || "Failed to create product."
        setError(errorMessage)
        toast.error(`Error al agregar producto: ${errorMessage}`)
      }
    } catch (err) {
      console.error("Error creating product:", err)
      const errorMessage = "An unexpected error occurred while creating the product."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await deleteProductAction(productId);
      if (result.success) {
        toast.success("Producto eliminado exitosamente.");
        await loadInitialData();
      } else {
        const errorMessage = result.error || "Failed to delete product.";
        setError(errorMessage);
        toast.error(`Error al eliminar producto: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMessage = "An unexpected error occurred while deleting the product.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Simplified Update Handler - A proper edit form would be needed for full functionality
  const handleInitiateEdit = (product: Product) => {
    setEditingProduct(product);
    // Pre-fill an edit form here if one exists. For now, just logs.
    console.log("Initiating edit for:", product);
    alert("Product editing initiated. A full edit form would appear here. For now, only delete and add are fully functional through UI actions.");
    // To make this useful without a form, we could allow small inline edits or a simple modal.
    // For this subtask, the primary goal is to connect delete and add.
    // If we were to proceed with a simple update:
    // const updatedName = prompt("Enter new name", product.name);
    // if (updatedName) {
    //   handleUpdateProduct(product.id, { ...product, name: updatedName });
    // }
  };


  const handleUpdateProduct = async (productId: number, updatedData: Partial<Product>) => {
      if (!updatedData.categoryId) {
        const msg = "Category ID is missing for update.";
        setError(msg);
        toast.error(msg);
        return;
      }

      setIsSubmitting(true);
      setError(null);
      try {
        const result = await updateProductAction(productId, {
          ...updatedData,
          price: Number(updatedData.price) || 0,
          variants: updatedData.product_variants?.map(pv => pv.name) || [],
        });
        if (result.success) {
          toast.success("Producto actualizado exitosamente.")
          setEditingProduct(null);
          await loadInitialData();
        } else {
          const errorMessage = result.error || "Failed to update product."
          setError(errorMessage);
          toast.error(`Error al actualizar producto: ${errorMessage}`);
        }
      } catch (err) {
          console.error("Error updating product:", err);
          const errorMessage = "An unexpected error occurred while updating product."
          setError(errorMessage);
          toast.error(errorMessage);
      } finally {
          setIsSubmitting(false);
      }
  };


  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestionar Productos</h2>
          <Button onClick={() => setShowAddForm(!showAddForm)} disabled={isSubmitting}>
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? "Cancelar" : "Agregar Producto"}
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            Error: {error}
          </div>
        )}

        {/* Add Product Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-4">Nuevo Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <Select
                    value={newProduct.categoryId}
                    onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                    disabled={isSubmitting || allCategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.length === 0 && <SelectItem value="" disabled>Cargando categorías...</SelectItem>}
                      {allCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nombre del producto"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Descripción del producto"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio (S/)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Producto</label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value: "single" | "multiple") => setNewProduct({ ...newProduct, type: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Simple (sin variantes)</SelectItem>
                      <SelectItem value="multiple">Múltiple (con variantes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Variantes (separadas por comas)
                    {newProduct.type === 'single' && <span className="text-xs text-gray-500"> (no aplicable para tipo Simple)</span>}
                  </label>
                  <Input
                    value={newProduct.variants}
                    onChange={(e) => setNewProduct({ ...newProduct, variants: e.target.value })}
                    placeholder="Ej: Picante, Suave, Extra Queso"
                    disabled={isSubmitting || newProduct.type === 'single'}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">URL de Imagen (Opcional)</label>
                  <Input
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddProduct} disabled={isSubmitting || !newProduct.categoryId || !newProduct.name.trim() || !newProduct.price.trim()}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar Producto
                </Button>
                <Button variant="outline" onClick={() => {setShowAddForm(false); setError(null); setNewProduct(initialNewProductState)}} disabled={isSubmitting}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products by Category */}
        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
            <p className="text-gray-500 mt-2">Cargando productos...</p>
          </div>
        ) : Object.keys(productsByCategories).length === 0 && !error ? (
           <p className="text-center text-gray-500 py-10">No hay productos para mostrar. Agregue categorías y productos.</p>
        ) : (
          Object.entries(productsByCategories).map(([categoryName, productsList]) => (
            <div key={categoryName} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">{categoryName}</h3>
              {productsList.length === 0 ? (
                <p className="text-sm text-gray-500">No hay productos en esta categoría.</p>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsList.map((product: Product) => ( // Explicitly type product
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="flex flex-col h-full"> {/* Ensure card takes full height */}
                      <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <p className="text-xs text-gray-500 pt-1">ID: {product.id.toString().substring(0,8)}...</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-2"> {/* Allow content to grow */}
                        {product.image && (
                            <img src={product.image} alt={product.name} className="rounded-md h-32 w-full object-cover my-2"/>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-3">{product.description || "Sin descripción."}</p>
                        <p className="text-lg font-bold text-blue-600">S/ {product.price.toFixed(2)}</p>
                        {product.product_variants && product.product_variants.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Variantes: {product.product_variants.map(v => v.name).join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-purple-600">
                          Tipo: {product.type === "multiple" ? "Múltiple (con variantes)" : "Simple (sin variantes)"}
                        </p>
                      </CardContent>
                      <div className="p-4 border-t mt-auto"> {/* Actions footer */}
                        <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleInitiateEdit(product)} // Changed to handleInitiateEdit
                              disabled={isSubmitting}
                            >
                              <Edit2 className="w-3 h-3 mr-1" /> Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting && editingProduct?.id !== product.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin"/> : <Trash2 className="w-3 h-3 mr-1" />}
                              Eliminar
                            </Button>
                          </div>
                        </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              )}
            </div>
          ))
        )}
      </motion.div>
    </div>
  )
}
