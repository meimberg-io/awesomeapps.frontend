import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdminEmail } from '@/lib/config/admin'

export async function GET(_request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ isAuthorized: false }, { status: 401 })
    }
    
    const isAuthorized = isAdminEmail(session.user.email)
    
    return NextResponse.json({ isAuthorized })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ isAuthorized: false }, { status: 500 })
  }
}

