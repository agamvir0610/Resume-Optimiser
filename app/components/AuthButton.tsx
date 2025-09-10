"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { getUserCredits, CreditBalance } from "@/lib/credits"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState<CreditBalance | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchCredits()
    }
  }, [session])

  const fetchCredits = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/credits?userId=${session.user.id}`)
      const data = await response.json()
      setCredits(data)
    } catch (error) {
      console.error("Failed to fetch credits:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        {/* Credits Display */}
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
          <div className="text-2xl">🪙</div>
          <div>
            <div className="text-sm text-gray-600">Credits</div>
            <div className="font-semibold text-blue-700">
              {loading ? "..." : credits?.available || 0}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {session.user?.name || "User"}
            </div>
            <div className="text-xs text-gray-500">
              {session.user?.email}
            </div>
          </div>
        </div>

        {/* Profile Button */}
        <a
          href="/profile"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Profile
        </a>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <a
        href="/auth/signin"
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Sign In
      </a>
    </div>
  )
}
