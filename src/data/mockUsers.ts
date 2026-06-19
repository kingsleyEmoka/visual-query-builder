export type MockUser = {
  id: string
  name: string
  age: number
  status: "active" | "inactive" | "banned"
  country: string
  createdAt: string
  isVerified: boolean
}

export const MOCK_USERS: MockUser[] = [
  { id: "1", name: "Ada Obi", age: 24, status: "active", country: "Nigeria", createdAt: "2023-01-15", isVerified: true },
  { id: "2", name: "Chidi Eze", age: 31, status: "inactive", country: "Nigeria", createdAt: "2022-08-02", isVerified: false },
  { id: "3", name: "Sarah Lee", age: 19, status: "active", country: "USA", createdAt: "2024-03-10", isVerified: true },
  { id: "4", name: "Tom Brown", age: 45, status: "banned", country: "UK", createdAt: "2021-11-23", isVerified: false },
  { id: "5", name: "Yusuf Bello", age: 27, status: "active", country: "Nigeria", createdAt: "2023-06-01", isVerified: true },
  { id: "6", name: "Linda Okoye", age: 35, status: "inactive", country: "Nigeria", createdAt: "2022-02-14", isVerified: true },
  { id: "7", name: "James Carter", age: 52, status: "active", country: "USA", createdAt: "2020-09-30", isVerified: false },
  { id: "8", name: "Aisha Mohammed", age: 22, status: "active", country: "Nigeria", createdAt: "2024-01-05", isVerified: true },
  { id: "9", name: "Mike Johnson", age: 38, status: "banned", country: "UK", createdAt: "2021-05-17", isVerified: false },
  { id: "10", name: "Grace Adeyemi", age: 29, status: "active", country: "Nigeria", createdAt: "2023-09-12", isVerified: true },
]