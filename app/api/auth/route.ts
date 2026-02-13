import { NextResponse } from "next/server"
import { getMatronCredentials, authenticateStudent } from "@/lib/store"

export async function POST(req: Request) {
  const body = await req.json()
  const { role, email, password, phoneNumber } = body

  if (role === "matron") {
    const creds = getMatronCredentials()
    if (email === creds.email && password === creds.password) {
      return NextResponse.json({
        success: true,
        user: { role: "matron", name: "Hostel Matron" },
      })
    }
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    )
  }

  if (role === "student") {
    if (!phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: "Phone number and password are required." },
        { status: 400 }
      )
    }
    const result = authenticateStudent(phoneNumber, password)
    if (result.success && result.student) {
      return NextResponse.json({
        success: true,
        user: {
          role: "student",
          name: result.student.name,
          roomNumber: result.student.roomNumber,
          phoneNumber: result.student.phoneNumber,
        },
      })
    }
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { success: false, message: "Invalid role." },
    { status: 400 }
  )
}
