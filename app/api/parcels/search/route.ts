import { NextResponse } from "next/server"
import { getParcelsBySearch } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""
  const parcels = getParcelsBySearch(query)
  return NextResponse.json({ parcels })
}
