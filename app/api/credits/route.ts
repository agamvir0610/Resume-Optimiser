import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserCredits, addCredits, consumeCredits } from "@/lib/credits"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId") || session.user.id

    const credits = await getUserCredits(userId)
    return NextResponse.json(credits)
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, amount } = await req.json()

    if (action === "consume") {
      const success = await consumeCredits(session.user.id, amount)
      if (!success) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === "add") {
      await addCredits(session.user.id, amount, "bonus")
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
