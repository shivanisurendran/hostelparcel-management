"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { MatronDashboard } from "@/components/matron-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"

export type UserSession =
  | { role: "matron"; name: string }
  | { role: "student"; name: string; roomNumber: string; phoneNumber: string }

export default function Home() {
  const [session, setSession] = useState<UserSession | null>(null)

  const handleLogout = () => setSession(null)

  if (!session) {
    return <LoginPage onLogin={setSession} />
  }

  if (session.role === "matron") {
    return <MatronDashboard user={session} onLogout={handleLogout} />
  }

  return <StudentDashboard user={session} onLogout={handleLogout} />
}
