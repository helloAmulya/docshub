"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Shield } from "lucide-react"

export function AdminHeader() {
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        })
        router.push("/")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-yellow-400/10 rounded-full">
          <Shield className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
          <p className="text-sm text-gray-400">Secure access granted</p>
        </div>
      </div>

      <Button variant="ghost" onClick={handleLogout} disabled={loggingOut} className="text-gray-400 hover:text-white">
        {loggingOut ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <span>Logging out...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
        )}
      </Button>
    </div>
  )
}
