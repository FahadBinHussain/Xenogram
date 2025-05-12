'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/utils/trpc'

// Define our own FamilyTree type since we can't import it directly
interface FamilyTree {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface FamilyTreeListProps {
  familyTrees: FamilyTree[]
}

export default function FamilyTreeList({ familyTrees: initialFamilyTrees }: FamilyTreeListProps) {
  const [familyTrees, setFamilyTrees] = useState(initialFamilyTrees)
  const deleteMutation = trpc.family.delete.useMutation({
    onSuccess: (_, variables) => {
      // Remove the deleted tree from the list
      setFamilyTrees(familyTrees.filter(tree => tree.id !== variables.id))
    }
  })
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this family tree? This action cannot be undone.')) {
      deleteMutation.mutate({ id })
    }
  }
  
  if (familyTrees.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No family trees found.</p>
      </div>
    )
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {familyTrees.map(tree => (
        <div key={tree.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{tree.name}</h3>
            {tree.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">{tree.description}</p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Last updated {formatDistanceToNow(new Date(tree.updatedAt), { addSuffix: true })}
            </p>
            <div className="flex space-x-2">
              <Link 
                href={`/family-tree/${tree.id}`} 
                className="btn-primary flex-1 text-center"
              >
                View
              </Link>
              <Link 
                href={`/family-tree/${tree.id}/edit`} 
                className="btn-secondary flex-1 text-center"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(tree.id)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                disabled={deleteMutation.isLoading}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 