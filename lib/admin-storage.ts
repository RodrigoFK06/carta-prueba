// Funciones para manejar el almacenamiento local de datos del menú

export const getMenuData = () => {
  if (typeof window === "undefined") return {}

  const stored = localStorage.getItem("nt-taco-menu-data")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error("Error parsing stored menu data:", error)
    }
  }

  // Datos por defecto si no hay nada guardado
  return {
    PROMOS: [
      {
        id: "promo-1",
        name: "3x2 Nigiris",
        description: "Lleva 12 y paga 8",
        price: 52.0,
        image: "/placeholder.svg?height=200&width=300",
        category: "PROMOS",
        variants: ["Tuna Shiso", "Sake Rocoto", "Hotate Truffle", "Avocado Brasa"],
        type: "multiple",
      },
      {
        id: "promo-2",
        name: "Helados 2x1",
        description: "Helados de temporada",
        price: 11.0,
        image: "/placeholder.svg?height=200&width=300",
        category: "PROMOS",
        variants: ["Vainilla", "Chocolate", "Fresa", "Mango"],
        type: "single",
      },
    ],
    "NORI TACOS X2": [
      {
        id: "taco-1",
        name: "Sesame Sake Taco",
        description: "tartar de salmón, arroz de sushi, palta, pepino japonés y salsa de sésamo",
        price: 25.0,
        image: "/placeholder.svg?height=200&width=300",
        category: "NORI TACOS X2",
        variants: ["Picante", "Suave", "Extra Sésamo"],
        type: "single",
      },
    ],
    "HAND ROLLS X2": [
      {
        id: "roll-1",
        name: "Ebi Panko Hand Roll",
        description: "langostino crocante y palta",
        price: 17.0,
        image: "/placeholder.svg?height=200&width=300",
        category: "HAND ROLLS X2",
        variants: ["Picante", "Suave", "Extra Sésamo"],
        type: "single",
      },
    ],
    "NT BOWLS": [
      {
        id: "bowl-1",
        name: "Teri Chicken",
        description: "pollo ahumado, salsa teriyaki, arroz de sushi y vegetales",
        price: 32.0,
        image: "/placeholder.svg?height=200&width=300",
        category: "NT BOWLS",
        variants: ["Picante", "Suave", "Extra Sésamo"],
        type: "single",
      },
    ],
  }
}

export const saveMenuData = (data: any) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("nt-taco-menu-data", JSON.stringify(data))
  } catch (error) {
    console.error("Error saving menu data:", error)
  }
}
