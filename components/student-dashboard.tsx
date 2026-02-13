"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Package,
  Search,
  LogOut,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Truck,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Parcel } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface StudentDashboardProps {
  user: { role: "student"; name: string; roomNumber: string; phoneNumber: string }
  onLogout: () => void
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [searchQuery, setSearchQuery] = useState(user.phoneNumber)

  const { data } = useSWR<{ parcels: Parcel[] }>(
    `/api/parcels/search?q=${encodeURIComponent(searchQuery)}`,
    fetcher,
    { refreshInterval: 5000 }
  )

  const parcels = data?.parcels ?? []

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isOverdue = (parcel: Parcel) => {
    if (parcel.status === "collected") return false
    const received = new Date(parcel.dateReceived).getTime()
    return Date.now() - received > 48 * 60 * 60 * 1000
  }

  const pendingCount = parcels.filter((p) => p.status === "pending").length
  const collectedCount = parcels.filter((p) => p.status === "collected").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">My Parcels</h1>
              <p className="text-xs text-muted-foreground">
                {user.name} &middot; Room {user.roomNumber}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="border-warning/30 bg-warning/5 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-warning-foreground" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/10 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{collectedCount}</p>
                <p className="text-xs text-muted-foreground">Collected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
              <Search className="h-4 w-4 text-primary" />
              Track Your Parcel
            </CardTitle>
            <CardDescription>
              Enter your room number, name, or mobile to find your parcel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by room number, name, or mobile..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Parcel Cards */}
        {parcels.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-card-foreground">No parcels found</p>
              <p className="text-sm text-muted-foreground">
                Try searching with a different term
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {parcels.map((parcel) => (
              <ParcelCard
                key={parcel.id}
                parcel={parcel}
                isOverdue={isOverdue(parcel)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ParcelCard({
  parcel,
  isOverdue,
  formatDate,
}: {
  parcel: Parcel
  isOverdue: boolean
  formatDate: (iso: string) => string
}) {
  const isPending = parcel.status === "pending"
  const isCollected = parcel.status === "collected"

  return (
    <Card
      className={`shadow-sm transition-all ${
        isOverdue
          ? "border-destructive/30"
          : isPending
            ? "border-primary/20"
            : "border-success/20"
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          {/* Top row: ID + Status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-card-foreground">
                {parcel.id}
              </span>
              {isCollected ? (
                <Badge className="bg-success text-success-foreground hover:bg-success/90">
                  Collected
                </Badge>
              ) : isOverdue ? (
                <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Overdue
                </Badge>
              ) : (
                <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
                  Pending
                </Badge>
              )}
            </div>
          </div>

          {/* Info row */}
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Courier</p>
                <p className="font-medium text-card-foreground">{parcel.courierName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="font-medium text-card-foreground">{formatDate(parcel.dateReceived)}</p>
              </div>
            </div>
            {parcel.dateCollected && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Collected</p>
                  <p className="font-medium text-card-foreground">
                    {formatDate(parcel.dateCollected)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Code or Delivered message */}
          {isPending && (
            <div
              className={`rounded-lg border-2 border-dashed p-4 ${
                isOverdue
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Your Security Code
                </p>
              </div>
              <p className="font-mono text-3xl font-bold tracking-[0.3em] text-card-foreground">
                {parcel.securityCode}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Provide this code to the matron to collect your parcel.
              </p>
              {isOverdue && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  This parcel has been waiting for over 48 hours.
                </div>
              )}
            </div>
          )}

          {isCollected && (
            <div className="rounded-lg border border-success/30 bg-success/10 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <p className="text-sm font-medium text-success">
                  Delivered Successfully.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
