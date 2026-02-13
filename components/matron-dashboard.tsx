"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Plus,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Parcel } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface MatronDashboardProps {
  user: { role: "matron"; name: string }
  onLogout: () => void
}

export function MatronDashboard({ user, onLogout }: MatronDashboardProps) {
  const { data, mutate } = useSWR<{
    parcels: Parcel[]
    stats: { totalToday: number; pending: number; collected: number; overdue: number }
  }>("/api/parcels", fetcher, { refreshInterval: 5000 })

  const [addForm, setAddForm] = useState({
    studentName: "",
    roomNumber: "",
    mobileNumber: "",
    courierName: "",
  })
  const [addLoading, setAddLoading] = useState(false)
  const [verifyModal, setVerifyModal] = useState<Parcel | null>(null)
  const [verifyCode, setVerifyCode] = useState("")
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "collected">("all")

  const parcels = data?.parcels ?? []
  const stats = data?.stats ?? { totalToday: 0, pending: 0, collected: 0, overdue: 0 }

  const filteredParcels =
    statusFilter === "all"
      ? parcels
      : parcels.filter((p) => p.status === statusFilter)

  const handleAddParcel = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!addForm.studentName || !addForm.roomNumber || !addForm.mobileNumber || !addForm.courierName) {
        toast.error("Please fill in all fields.")
        return
      }
      setAddLoading(true)
      try {
        const res = await fetch("/api/parcels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addForm),
        })
        const result = await res.json()
        if (res.ok) {
          toast.success("Parcel added successfully. Security code generated.")
          setAddForm({ studentName: "", roomNumber: "", mobileNumber: "", courierName: "" })
          mutate()
        } else {
          toast.error(result.error || "Failed to add parcel.")
        }
      } catch {
        toast.error("Something went wrong.")
      } finally {
        setAddLoading(false)
      }
    },
    [addForm, mutate]
  )

  const handleVerify = useCallback(async () => {
    if (!verifyModal || !verifyCode) {
      toast.error("Please enter the security code.")
      return
    }
    setVerifyLoading(true)
    try {
      const res = await fetch("/api/parcels/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: verifyModal.id, code: verifyCode }),
      })
      const result = await res.json()
      if (result.success) {
        toast.success(result.message)
        setVerifyModal(null)
        setVerifyCode("")
        mutate()
      } else {
        toast.error(result.message)
        if (result.locked) {
          setVerifyModal(null)
          setVerifyCode("")
        }
      }
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setVerifyLoading(false)
    }
  }, [verifyModal, verifyCode, mutate])

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">Matron Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Welcome, {user.name}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            title="Total Today"
            value={stats.totalToday}
            icon={<Package className="h-5 w-5" />}
            className="border-primary/20 bg-primary/5"
            iconClassName="text-primary"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            className="border-warning/30 bg-warning/5"
            iconClassName="text-warning-foreground"
          />
          <StatsCard
            title="Collected"
            value={stats.collected}
            icon={<CheckCircle2 className="h-5 w-5" />}
            className="border-success/30 bg-success/10"
            iconClassName="text-success"
          />
          <StatsCard
            title="Overdue (48h+)"
            value={stats.overdue}
            icon={<AlertTriangle className="h-5 w-5" />}
            className="border-destructive/30 bg-destructive/5"
            iconClassName="text-destructive"
          />
        </div>

        {/* Add New Parcel */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <CardTitle className="text-base text-card-foreground">Add New Parcel</CardTitle>
            </div>
            <CardDescription>
              Record a newly received parcel. A unique security code will be generated automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAddParcel}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter name"
                  value={addForm.studentName}
                  onChange={(e) => setAddForm((f) => ({ ...f, studentName: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g. 201"
                  value={addForm.roomNumber}
                  onChange={(e) => setAddForm((f) => ({ ...f, roomNumber: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  placeholder="e.g. 9876543210"
                  value={addForm.mobileNumber}
                  onChange={(e) => setAddForm((f) => ({ ...f, mobileNumber: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="courierName">Courier Name</Label>
                <Input
                  id="courierName"
                  placeholder="e.g. Amazon"
                  value={addForm.courierName}
                  onChange={(e) => setAddForm((f) => ({ ...f, courierName: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <Button type="submit" disabled={addLoading} className="w-full sm:w-auto">
                  {addLoading ? "Adding..." : "Add Parcel"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Parcel Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base text-card-foreground">Parcel Management</CardTitle>
                <CardDescription>
                  {filteredParcels.length} parcel{filteredParcels.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as "all" | "pending" | "collected")}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parcels</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="collected">Collected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcel ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">Room</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead className="hidden md:table-cell">Date Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No parcels found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParcels.map((parcel) => (
                      <TableRow key={parcel.id}>
                        <TableCell className="font-mono text-sm font-medium text-card-foreground">
                          {parcel.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-card-foreground">{parcel.studentName}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              Room {parcel.roomNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{parcel.roomNumber}</TableCell>
                        <TableCell>{parcel.courierName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(parcel.dateReceived)}
                        </TableCell>
                        <TableCell>
                          {parcel.status === "collected" ? (
                            <Badge className="bg-success text-success-foreground hover:bg-success/90">
                              Collected
                            </Badge>
                          ) : isOverdue(parcel) ? (
                            <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Overdue
                            </Badge>
                          ) : (
                            <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {parcel.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5"
                              onClick={() => {
                                setVerifyModal(parcel)
                                setVerifyCode("")
                              }}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">Verify & Deliver</span>
                              <span className="lg:hidden">Verify</span>
                            </Button>
                          )}
                          {parcel.status === "collected" && (
                            <span className="text-xs text-muted-foreground">Delivered</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Verify Modal */}
      <Dialog
        open={!!verifyModal}
        onOpenChange={(open) => {
          if (!open) {
            setVerifyModal(null)
            setVerifyCode("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-card-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Security Code Verification
            </DialogTitle>
            <DialogDescription>
              Enter the 6-digit security code provided by the student to verify and deliver parcel{" "}
              <span className="font-mono font-semibold">{verifyModal?.id}</span>.
            </DialogDescription>
          </DialogHeader>
          {verifyModal && (
            <div className="flex flex-col gap-4 pt-2">
              <div className="rounded-lg bg-muted p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Student</p>
                    <p className="font-medium text-card-foreground">{verifyModal.studentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium text-card-foreground">{verifyModal.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Courier</p>
                    <p className="font-medium text-card-foreground">{verifyModal.courierName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Attempts</p>
                    <p className="font-medium text-card-foreground">
                      {verifyModal.verificationAttempts}/3 used
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="security-code">Enter Security Code</Label>
                <Input
                  id="security-code"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center font-mono text-lg tracking-widest"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerify()
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setVerifyModal(null)
                    setVerifyCode("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={verifyLoading || verifyCode.length !== 6}
                  onClick={handleVerify}
                >
                  {verifyLoading ? "Verifying..." : "Verify & Deliver"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon,
  className,
  iconClassName,
}: {
  title: string
  value: number
  icon: React.ReactNode
  className?: string
  iconClassName?: string
}) {
  return (
    <Card className={`shadow-sm ${className ?? ""}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={iconClassName}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
