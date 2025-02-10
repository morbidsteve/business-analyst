"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LaborCategory = {
    id: string
    title: string
    description: string
    minRate: number
    maxRate: number
    educationReq: string
    experienceReq: string
    clearanceReq: string
    active: boolean
}

type LaborCategoryManagementProps = {
    contractId: string
}

export function LaborCategoryManagement({ contractId }: LaborCategoryManagementProps) {
    const [laborCategories, setLaborCategories] = useState<LaborCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newCategory, setNewCategory] = useState<Partial<LaborCategory>>({})
    const { toast } = useToast()

    useEffect(() => {
        fetchLaborCategories()
    }, []) // Removed unnecessary dependency: contractId

    const fetchLaborCategories = async () => {
        try {
            const response = await fetch(`/api/labor-categories?contractId=${contractId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch labor categories")
            }
            const data = await response.json()
            setLaborCategories(data)
        } catch (error) {
            console.error("Error fetching labor categories:", error)
            toast({
                title: "Error",
                description: "Failed to fetch labor categories. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddCategory = async () => {
        try {
            const response = await fetch("/api/labor-categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...newCategory, contractId }),
            })

            if (!response.ok) {
                throw new Error("Failed to add labor category")
            }

            toast({
                title: "Success",
                description: "Labor category added successfully",
            })
            setIsAdding(false)
            setNewCategory({})
            fetchLaborCategories()
        } catch (error) {
            console.error("Error adding labor category:", error)
            toast({
                title: "Error",
                description: "Failed to add labor category. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div>Loading labor categories...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Labor Categories</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={() => setIsAdding(true)} className="mb-4">
                    Add New Labor Category
                </Button>
                {isAdding && (
                    <Card className="mb-4">
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={newCategory.title || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newCategory.description || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="minRate">Minimum Rate</Label>
                                <Input
                                    id="minRate"
                                    type="number"
                                    value={newCategory.minRate || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, minRate: Number.parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxRate">Maximum Rate</Label>
                                <Input
                                    id="maxRate"
                                    type="number"
                                    value={newCategory.maxRate || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, maxRate: Number.parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="educationReq">Education Requirement</Label>
                                <Input
                                    id="educationReq"
                                    value={newCategory.educationReq || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, educationReq: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="experienceReq">Experience Requirement</Label>
                                <Input
                                    id="experienceReq"
                                    value={newCategory.experienceReq || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, experienceReq: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="clearanceReq">Clearance Requirement</Label>
                                <Input
                                    id="clearanceReq"
                                    value={newCategory.clearanceReq || ""}
                                    onChange={(e) => setNewCategory({ ...newCategory, clearanceReq: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleAddCategory}>Add Category</Button>
                            <Button variant="outline" onClick={() => setIsAdding(false)}>
                                Cancel
                            </Button>
                        </CardContent>
                    </Card>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Min Rate</TableHead>
                            <TableHead>Max Rate</TableHead>
                            <TableHead>Education</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Clearance</TableHead>
                            <TableHead>Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {laborCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.title}</TableCell>
                                <TableCell>${category.minRate.toFixed(2)}</TableCell>
                                <TableCell>${category.maxRate.toFixed(2)}</TableCell>
                                <TableCell>{category.educationReq}</TableCell>
                                <TableCell>{category.experienceReq}</TableCell>
                                <TableCell>{category.clearanceReq}</TableCell>
                                <TableCell>{category.active ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

