import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const billingInfo = await prisma.billingInfo.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(billingInfo || {
      stripeCustomerId: null,
      paymentMethodId: null,
      billingAddress: null,
      taxId: null
    })

  } catch (error) {
    console.error('Get billing info error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { stripeCustomerId, paymentMethodId, billingAddress, taxId } = await req.json()

    const billingInfo = await prisma.billingInfo.upsert({
      where: { userId: session.user.id },
      update: {
        stripeCustomerId,
        paymentMethodId,
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        taxId,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        stripeCustomerId,
        paymentMethodId,
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        taxId
      }
    })

    return NextResponse.json({
      message: 'Billing information updated successfully',
      billingInfo: {
        ...billingInfo,
        billingAddress: billingInfo.billingAddress ? JSON.parse(billingInfo.billingAddress) : null
      }
    })

  } catch (error) {
    console.error('Update billing info error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
