"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertTriangle, Eye, MousePointerClick, ShoppingCart } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getAnalyticsSummaryAction } from "@/app/actions/menuActions"
import { Button } from "@/components/ui/button" // For a potential back/refresh button

// Define types locally, assuming they are not exported from menuActions.ts
// Or ensure they are exported from menuActions.ts and import them.
interface AnalyticsProductSummary {
  productId: string
  productName: string
  count?: number // For views/clicks
  totalQuantity?: number // For add_to_cart
}

interface AnalyticsSummary {
  mostViewedProducts: AnalyticsProductSummary[]
  mostClickedProducts: AnalyticsProductSummary[]
  mostAddedToCartProducts: AnalyticsProductSummary[]
}

export default function AnalyticsViewer() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAnalyticsSummaryAction()
      if (result.success && result.summary) {
        setSummary(result.summary)
      } else {
        setError(result.error || "Failed to load analytics summary.")
        setSummary(null)
      }
    } catch (err) {
      console.error("Error fetching analytics summary:", err)
      setError("An unexpected error occurred while fetching analytics.")
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Cargando analíticas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 p-6 rounded-lg border border-red-200">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-700 font-semibold">Error al cargar analíticas:</p>
        <p className="text-red-600 text-sm">{error}</p>
        <Button onClick={fetchAnalytics} className="mt-6">Intentar de nuevo</Button>
      </div>
    )
  }

  if (!summary ||
      (summary.mostViewedProducts.length === 0 &&
       summary.mostClickedProducts.length === 0 &&
       summary.mostAddedToCartProducts.length === 0)) {
    return (
        <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No hay datos de analíticas disponibles aún.</p>
            <Button onClick={fetchAnalytics} className="mt-6">Refrescar</Button>
        </div>
    ),
  }

  const renderProductList = (products: AnalyticsProductSummary[], metric: "count" | "totalQuantity", unit: string) => {
    if (products.length === 0) {
      return <p className="text-sm text-gray-500">No hay datos para esta métrica aún.</p>;
    }
    return (
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.productId} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
            <span className="text-sm text-gray-700">{product.productName} (ID: {product.productId.substring(0,6)}...)</span>
            <span className="text-sm font-semibold text-blue-600">
              {metric === "count" ? product.count : product.totalQuantity} {unit}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Resumen de Analíticas</h1>
        <Button onClick={fetchAnalytics} variant="outline" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : null}
          Refrescar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Más Vistos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderProductList(summary.mostViewedProducts, "count", "vistas")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Más Clickeados</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderProductList(summary.mostClickedProducts, "count", "clicks")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Más Agregados al Carrito</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {renderProductList(summary.mostAddedToCartProducts, "totalQuantity", "unidades")}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
