import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface CreditBalance {
  total: number
  available: number
  used: number
}

export async function getUserCredits(userId: string): Promise<CreditBalance> {
  const credits = await prisma.credit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })

  const total = credits.reduce((sum, credit) => {
    if (credit.type === "purchase" || credit.type === "bonus") {
      return sum + credit.amount
    } else if (credit.type === "consumption") {
      return sum - credit.amount
    }
    return sum
  }, 0)

  const used = credits
    .filter(credit => credit.type === "consumption")
    .reduce((sum, credit) => sum + credit.amount, 0)

  return {
    total: Math.max(0, total),
    available: Math.max(0, total),
    used
  }
}

export async function addCredits(userId: string, amount: number, type: "purchase" | "bonus" = "purchase") {
  return await prisma.credit.create({
    data: {
      userId,
      amount,
      type
    }
  })
}

export async function consumeCredits(userId: string, amount: number): Promise<boolean> {
  const balance = await getUserCredits(userId)
  
  if (balance.available < amount) {
    return false
  }

  await prisma.credit.create({
    data: {
      userId,
      amount,
      type: "consumption"
    }
  })

  return true
}

export async function createTransaction(
  userId: string,
  stripeId: string | null,
  amount: number,
  price: number,
  status: "pending" | "completed" | "failed" = "pending"
) {
  return await prisma.transaction.create({
    data: {
      userId,
      stripeId,
      amount,
      price,
      status
    }
  })
}

export async function updateTransactionStatus(
  transactionId: string,
  status: "completed" | "failed"
) {
  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status,
      completedAt: status === "completed" ? new Date() : null
    }
  })
}