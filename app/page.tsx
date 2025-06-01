"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import LoadingScreen from "@/components/screens/loading-screen"
import WelcomeScreen from "@/components/screens/welcome-screen"
import OrderTypeScreen from "@/components/screens/order-type-screen"
import NameInputScreen from "@/components/screens/name-input-screen"
import MenuScreen from "@/components/screens/menu-screen"
import AdminPanel from "@/components/admin/admin-panel"

type Screen = "loading" | "welcome" | "orderType" | "nameInput" | "menu" | "admin"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("loading")
  const [customerName, setCustomerName] = useState("")
  const [orderType, setOrderType] = useState<"local" | "takeaway" | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("welcome")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleNameSubmit = (name: string) => {
    setCustomerName(name)
    setCurrentScreen("menu")
  }

  const handleOrderTypeSelect = (type: "local" | "takeaway") => {
    setOrderType(type)
    setCurrentScreen("nameInput")
  }

  const handleAdminAccess = () => {
    setCurrentScreen("admin")
  }

  const handleBackNavigation = () => {
    switch (currentScreen) {
      case "orderType":
        setCurrentScreen("welcome")
        break
      case "nameInput":
        setCurrentScreen("orderType")
        break
      case "menu":
        setCurrentScreen("nameInput")
        break
      case "admin":
        setCurrentScreen("welcome")
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {currentScreen === "loading" && <LoadingScreen key="loading" />}
        {currentScreen === "welcome" && (
          <WelcomeScreen key="welcome" onNext={() => handleScreenTransition("orderType")} />
        )}
        {currentScreen === "orderType" && (
          <OrderTypeScreen
            key="orderType"
            onSelect={handleOrderTypeSelect}
            onBack={() => handleScreenTransition("welcome")}
          />
        )}
        {currentScreen === "nameInput" && (
          <NameInputScreen
            key="nameInput"
            onSubmit={handleNameSubmit}
            onBack={() => handleScreenTransition("orderType")}
            onAdminAccess={handleAdminAccess}
          />
        )}
        {currentScreen === "menu" && (
          <MenuScreen key="menu" customerName={customerName} orderType={orderType!} onBack={handleBackNavigation} />
        )}
        {currentScreen === "admin" && <AdminPanel key="admin" onBack={handleBackNavigation} />}
      </AnimatePresence>
    </div>
  )
}
