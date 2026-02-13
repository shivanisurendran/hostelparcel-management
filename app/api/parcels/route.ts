import { NextResponse } from "next/server"
import { getAllParcels, addParcel, getStats } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const parcels = getAllParcels()
  const stats = getStats()
  return NextResponse.json({ parcels, stats })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { studentName, roomNumber, mobileNumber, courierName } = body

  if (!studentName || !roomNumber || !mobileNumber || !courierName) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    )
  }

  const parcel = addParcel({ studentName, roomNumber, mobileNumber, courierName })
  return NextResponse.json({ parcel }, { status: 201 })
}
