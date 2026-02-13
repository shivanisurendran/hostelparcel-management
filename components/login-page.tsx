"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Package, ShieldCheck, GraduationCap, Lock, Mail, Phone } from "lucide-react"
import type { UserSession } from "@/app/page"

interface LoginPageProps {
  onLogin: (session: UserSession) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<"matron" | "student">("matron")
  const [loading, setLoading] = useState(false)

  const [matronEmail, setMatronEmail] = useState("")
  const [matronPassword, setMatronPassword] = useState("")

  const [studentPhone, setStudentPhone] = useState("")
  const [studentPassword, setStudentPassword] = useState("")

  const handleMatronLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!matronEmail || !matronPassword) {
      toast.error("Please fill in all fields.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "matron",
          email: matronEmail,
          password: matronPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Welcome, Matron!")
        onLogin(data.user)
      } else {
        toast.error(data.message || "Login failed.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentPhone || !studentPassword) {
      toast.error("Please fill in all fields.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "student",
          phoneNumber: studentPhone,
          password: studentPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Welcome, ${data.user.name}!`)
        onLogin(data.user)
      } else {
        toast.error(data.message || "Invalid phone number or password.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
          <Package className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Smart Hostel Parcel Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Secure parcel tracking with one-time security code verification
          </p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-card-foreground">Sign In</CardTitle>
          <CardDescription>Choose your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={role}
            onValueChange={(v) => setRole(v as "matron" | "student")}
          >
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="matron" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Matron
              </TabsTrigger>
              <TabsTrigger value="student" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matron">
              <form onSubmit={handleMatronLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="matron-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="matron-email"
                      type="email"
                      placeholder="matron@hostel.com"
                      className="pl-10"
                      value={matronEmail}
                      onChange={(e) => setMatronEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="matron-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="matron-password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                      value={matronPassword}
                      onChange={(e) => setMatronPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-2 w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in as Matron"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo: matron@hostel.com / matron123
                </p>
              </form>
            </TabsContent>

            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="student-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="student-phone"
                      placeholder="e.g. 9876543210"
                      className="pl-10"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="student-password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-2 w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in as Student"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo: 9876543210 / student123
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
