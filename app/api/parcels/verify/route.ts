import { NextResponse } from "next/server"
import { verifyAndCollect } from "@/lib/store"

export async function POST(req: Request) {
  const body = await req.json()
  const { parcelId, code } = body

  if (!parcelId || !code) {
    return NextResponse.json(
      { success: false, message: "Parcel ID and security code are required." },
      { status: 400 }
    )
  }

  const result = verifyAndCollect(parcelId, code)
  return NextResponse.json(result)
}
