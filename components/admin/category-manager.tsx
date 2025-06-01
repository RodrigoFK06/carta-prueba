"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  getAllCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/menuActions"

interface Category {
  id: string
  name: string
}

// interface CategoryManagerProps {} // No props needed anymore

export default function CategoryManager(/*props: CategoryManagerProps*/) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)


  const loadCategories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAllCategoriesAction()
      if (result.success && result.categories) {
        setCategories(result.categories)
      } else {
        setError(result.error || "Failed to load categories.")
        setCategories([])
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("An unexpected error occurred while fetching categories.")
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await createCategoryAction(newCategoryName.trim())
      if (result.success) {
        toast.success("Categoría creada exitosamente.")
        setNewCategoryName("")
        await loadCategories() // Refresh list
      } else {
        const errorMessage = result.error || "Failed to create category."
        setError(errorMessage)
        toast.error(`Error al crear categoría: ${errorMessage}`)
      }
    } catch (err) {
      console.error("Error creating category:", err)
      const errorMessage = "An unexpected error occurred while creating the category."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await deleteCategoryAction(categoryId)
      if (result.success) {
        toast.success("Categoría eliminada exitosamente.")
        await loadCategories() // Refresh list
      } else {
        const errorMessage = result.error || "Failed to delete category."
        setError(errorMessage)
        toast.error(`Error al eliminar categoría: ${errorMessage}`)
      }
    } catch (err) {
      console.error("Error deleting category:", err)
      const errorMessage = "An unexpected error occurred while deleting the category."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (category: Category) => {
    setEditingCategory(category)
    setEditingName(category.name)
    setError(null)
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editingName.trim() || editingName.trim() === editingCategory.name) {
      setEditingCategory(null)
      setEditingName("")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await updateCategoryAction(editingCategory.id, editingName.trim())
      if (result.success) {
        toast.success("Categoría actualizada exitosamente.")
        setEditingCategory(null)
        setEditingName("")
        await loadCategories() // Refresh list
      } else {
        const errorMessage = result.error || "Failed to update category."
        setError(errorMessage)
        toast.error(`Error al actualizar categoría: ${errorMessage}`)
        // Keep editing mode open if there was an error to allow correction
      }
    } catch (err) {
      console.error("Error updating category:", err)
      const errorMessage = "An unexpected error occurred while updating the category."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
      // Only close editing mode if successful
      if (!error && !isSubmitting) { // Check error state before closing
         // This logic is tricky, if error occurred, we want to keep it open
      }
    }
  }

  const cancelEditing = () => {
    setEditingCategory(null)
    setEditingName("")
    setError(null)
  }


  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Categorías</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            Error: {error}
          </div>
        )}

        {/* Add new category */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Nombre de nueva categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isSubmitting && handleAddCategory()}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button onClick={handleAddCategory} disabled={!newCategoryName.trim() || isSubmitting}>
            {isSubmitting && !editingCategory ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Agregar
          </Button>
        </div>

        {/* Categories list */}
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
            <p className="text-gray-500 mt-2">Loading categories...</p>
          </div>
        ) : categories.length === 0 && !error ? (
          <p className="text-center text-gray-500 py-4">No categories found. Add one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
              >
                <Card>
                  <CardHeader className="pb-3">
                    {editingCategory?.id === category.id ? (
                      <motion.div
                        className="flex gap-2 items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="text-sm"
                          onKeyPress={(e) => e.key === "Enter" && !isSubmitting && handleEditCategory()}
                          disabled={isSubmitting}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleEditCategory}
                          className="h-8 w-8"
                          disabled={isSubmitting || editingName.trim() === "" || editingName.trim() === editingCategory.name}
                        >
                          {isSubmitting && editingCategory?.id === category.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEditing} className="h-8 w-8" disabled={isSubmitting}>
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditing(category)}
                            className="h-8 w-8"
                            disabled={isSubmitting || editingCategory !== null}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            disabled={isSubmitting || editingCategory !== null}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {/* Product count removed as this component now only manages categories */}
                     <p className="text-sm text-gray-400 italic text-center">ID: {category.id.substring(0,8)}...</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
