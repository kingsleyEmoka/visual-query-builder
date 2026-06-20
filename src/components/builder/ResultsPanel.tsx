"use client"

import { useQueryStore } from "@/store/queryStore"
import { MOCK_USERS } from "@/data/mockUsers"
import { filterDataset } from "@/lib/filterDataset"

export function ResultsPanel() {
  const { tree } = useQueryStore()
  const results = filterDataset(tree, MOCK_USERS)

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">
        Results ({results.length} of {MOCK_USERS.length})
      </h2>

      {results.length === 0 ? (
        <p className="text-sm text-gray-400">No matching results.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border">Verified</th>
            </tr>
          </thead>
          <tbody>
            {results.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.age}</td>
                <td className="p-2 border">{user.status}</td>
                <td className="p-2 border">{user.country}</td>
                <td className="p-2 border">{user.isVerified ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}