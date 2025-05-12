'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'

interface CreateFamilyTreeButtonProps {
  variant?: 'default' | 'large'
}

export default function CreateFamilyTreeButton({ variant = 'default' }: CreateFamilyTreeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()
  
  const createMutation = trpc.family.create.useMutation({
    onSuccess: (data) => {
      router.push(`/family-tree/${data.id}`)
    }
  })
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createMutation.mutate({
      name,
      description: description || undefined
    })
  }
  
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }
  
  return (
    <>
      <button
        className={variant === 'large' ? 'btn-primary text-lg px-8 py-3' : 'btn-primary'}
        onClick={() => setIsModalOpen(true)}
      >
        Create Family Tree
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Create New Family Tree</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    className="input"
                    rows={3}
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={createMutation.isLoading || !name}
                  >
                    {createMutation.isLoading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 