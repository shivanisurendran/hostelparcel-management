export interface Parcel {
  id: string
  studentName: string
  roomNumber: string
  mobileNumber: string
  courierName: string
  securityCode: string
  status: "pending" | "collected"
  dateReceived: string
  dateCollected?: string
  verificationAttempts: number
}

export interface Student {
  id: string
  name: string
  roomNumber: string
  phoneNumber: string
  passwordHash: string
}

export interface MatronCredentials {
  email: string
  password: string
}

const MATRON_CREDENTIALS: MatronCredentials = {
  email: "matron@hostel.com",
  password: "matron123",
}

// Simulated student accounts with pre-hashed passwords.
// In production, passwords would be hashed with bcrypt.
// Plain text equivalents shown for demo purposes only.
const students: Student[] = [
  {
    id: "STU-001",
    name: "Aarav Sharma",
    roomNumber: "201",
    phoneNumber: "9876543210",
    passwordHash: "hashed_student123", // demo password: student123
  },
  {
    id: "STU-002",
    name: "Priya Patel",
    roomNumber: "305",
    phoneNumber: "9123456789",
    passwordHash: "hashed_student123", // demo password: student123
  },
  {
    id: "STU-003",
    name: "Rahul Verma",
    roomNumber: "102",
    phoneNumber: "9988776655",
    passwordHash: "hashed_student123", // demo password: student123
  },
  {
    id: "STU-004",
    name: "Sneha Gupta",
    roomNumber: "201",
    phoneNumber: "9012345678",
    passwordHash: "hashed_student123", // demo password: student123
  },
]

// Simulated bcrypt comparison. In production, use bcrypt.compare().
function verifyPassword(plain: string, hash: string): boolean {
  return hash === `hashed_${plain}`
}

export function authenticateStudent(
  phoneNumber: string,
  password: string
): { success: boolean; student?: Student; message?: string } {
  const student = students.find((s) => s.phoneNumber === phoneNumber)
  if (!student) {
    return { success: false, message: "Invalid phone number or password." }
  }
  if (!verifyPassword(password, student.passwordHash)) {
    return { success: false, message: "Invalid phone number or password." }
  }
  return { success: true, student }
}

let parcels: Parcel[] = [
  {
    id: "PKG-001",
    studentName: "Aarav Sharma",
    roomNumber: "201",
    mobileNumber: "9876543210",
    courierName: "Amazon",
    securityCode: "482917",
    status: "pending",
    dateReceived: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verificationAttempts: 0,
  },
  {
    id: "PKG-002",
    studentName: "Priya Patel",
    roomNumber: "305",
    mobileNumber: "9123456789",
    courierName: "Flipkart",
    securityCode: "173659",
    status: "collected",
    dateReceived: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    dateCollected: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    verificationAttempts: 0,
  },
  {
    id: "PKG-003",
    studentName: "Rahul Verma",
    roomNumber: "102",
    mobileNumber: "9988776655",
    courierName: "Delhivery",
    securityCode: "639401",
    status: "pending",
    dateReceived: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    verificationAttempts: 0,
  },
  {
    id: "PKG-004",
    studentName: "Sneha Gupta",
    roomNumber: "201",
    mobileNumber: "9012345678",
    courierName: "BlueDart",
    securityCode: "815274",
    status: "pending",
    dateReceived: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    verificationAttempts: 0,
  },
]

let nextId = 5

function generateSecurityCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function generateParcelId(): string {
  const id = `PKG-${String(nextId).padStart(3, "0")}`
  nextId++
  return id
}

export function getMatronCredentials(): MatronCredentials {
  return MATRON_CREDENTIALS
}

export function getAllParcels(): Parcel[] {
  return [...parcels]
}

export function getParcelsBySearch(query: string): Parcel[] {
  if (!query.trim()) return [...parcels]
  const q = query.toLowerCase().trim()
  return parcels.filter(
    (p) =>
      p.studentName.toLowerCase().includes(q) ||
      p.roomNumber.toLowerCase().includes(q) ||
      p.mobileNumber.includes(q)
  )
}

export function addParcel(data: {
  studentName: string
  roomNumber: string
  mobileNumber: string
  courierName: string
}): Parcel {
  const newParcel: Parcel = {
    id: generateParcelId(),
    studentName: data.studentName,
    roomNumber: data.roomNumber,
    mobileNumber: data.mobileNumber,
    courierName: data.courierName,
    securityCode: generateSecurityCode(),
    status: "pending",
    dateReceived: new Date().toISOString(),
    verificationAttempts: 0,
  }
  parcels = [newParcel, ...parcels]
  return newParcel
}

export function verifyAndCollect(
  parcelId: string,
  code: string
): { success: boolean; message: string; locked?: boolean } {
  const parcel = parcels.find((p) => p.id === parcelId)
  if (!parcel) return { success: false, message: "Parcel not found." }
  if (parcel.status === "collected")
    return { success: false, message: "Parcel already collected." }
  if (parcel.verificationAttempts >= 3)
    return {
      success: false,
      message: "Maximum verification attempts reached. Parcel is locked.",
      locked: true,
    }

  if (parcel.securityCode === code) {
    parcel.status = "collected"
    parcel.dateCollected = new Date().toISOString()
    return { success: true, message: "Parcel verified and marked as collected." }
  } else {
    parcel.verificationAttempts++
    const remaining = 3 - parcel.verificationAttempts
    if (remaining === 0) {
      return {
        success: false,
        message: "Incorrect code. Maximum attempts reached. Parcel is locked.",
        locked: true,
      }
    }
    return {
      success: false,
      message: `Incorrect security code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    }
  }
}

export function getStats() {
  const now = new Date()
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString()
  const fortyEightHoursAgo = new Date(
    now.getTime() - 48 * 60 * 60 * 1000
  ).toISOString()

  const todayParcels = parcels.filter((p) => p.dateReceived >= todayStart)
  const pending = parcels.filter((p) => p.status === "pending")
  const collected = parcels.filter((p) => p.status === "collected")
  const overdue = parcels.filter(
    (p) => p.status === "pending" && p.dateReceived < fortyEightHoursAgo
  )

  return {
    totalToday: todayParcels.length,
    pending: pending.length,
    collected: collected.length,
    overdue: overdue.length,
  }
}
