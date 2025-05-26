"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash, Plus, Save, X } from "lucide-react"

type Category = {
  id: string
  name: string
  color: string
  count: number
  isEditing?: boolean
}

export function EventCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Lecture", color: "#3b82f6", count: 12 },
    { id: "2", name: "Janazah", color: "#6b7280", count: 5 },
    { id: "3", name: "Iftar", color: "#10b981", count: 8 },
    { id: "4", name: "Class", color: "#8b5cf6", count: 15 },
    { id: "5", name: "Other", color: "#f59e0b", count: 7 },
  ])

  const [newCategory, setNewCategory] = useState({ name: "", color: "#000000" })
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)

  const handleEditStart = (id: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, isEditing: true } : { ...category, isEditing: false },
      ),
    )
  }

  const handleEditCancel = () => {
    setCategories(categories.map((category) => ({ ...category, isEditing: false })))
  }

  const handleEditChange = (id: string, field: keyof Category, value: string) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, [field]: value } : category)))
  }

  const handleEditSave = (id: string) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, isEditing: false } : category)))
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory.name,
          color: newCategory.color,
          count: 0,
        },
      ])
      setNewCategory({ name: "", color: "#000000" })
      setShowNewCategoryForm(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Event Categories</h3>
        {!showNewCategoryForm && (
          <Button onClick={() => setShowNewCategoryForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {showNewCategoryForm && (
        <div className="flex items-center space-x-2 border p-4 rounded-md bg-muted/50">
          <Input
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="max-w-xs"
          />
          <Input
            type="color"
            value={newCategory.color}
            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
            className="w-16 p-1 h-10"
          />
          <Button onClick={handleAddCategory}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" onClick={() => setShowNewCategoryForm(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Events</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.isEditing ? (
                      <Input
                        value={category.name}
                        onChange={(e) => handleEditChange(category.id, "name", e.target.value)}
                        className="max-w-xs"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge style={{ backgroundColor: category.color }}>&nbsp;</Badge>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {category.isEditing ? (
                      <Input
                        type="color"
                        value={category.color}
                        onChange={(e) => handleEditChange(category.id, "color", e.target.value)}
                        className="w-16 p-1 h-10"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: category.color }}></div>
                        <span className="text-xs text-muted-foreground">{category.color}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{category.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {category.isEditing ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEditSave(category.id)}>
                            <Save className="h-4 w-4" />
                            <span className="sr-only">Save</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleEditCancel}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEditStart(category.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            disabled={category.count > 0}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <p className="text-sm text-muted-foreground">
        Note: Categories with associated events cannot be deleted. You must reassign or delete those events first.
      </p>
    </div>
  )
}
