"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    position: z.string().min(1, "Position is required"),
    department: z.string().min(1, "Department is required"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    hourlyRate: z.number().min(0, "Hourly rate must be a positive number"),
    contractId: z.string().optional(),
    laborCategoryId: z.string().optional(),
    isPlanning: z.boolean().default(false),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

type Contract = {
    id: string
    contractNumber: string
    title: string
}

type LaborCategory = {
    id: string
    title: string
}

type AddEmployeeFormProps = {
    programId: string
}

export function AddEmployeeForm({ programId }: AddEmployeeFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [contracts, setContracts] = useState<Contract[]>([])
    const [laborCategories, setLaborCategories] = useState<LaborCategory[]>([])
    const [selectedContract, setSelectedContract] = useState<string | null>(null)
    const [isPlanning, setIsPlanning] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
    })

    const watchContractId = watch("contractId")

    useEffect(() => {
        fetchContracts()
    }, [])

    useEffect(() => {
        if (watchContractId) {
            fetchLaborCategories(watchContractId)
        }
    }, [watchContractId])

    const fetchContracts = async () => {
        try {
            const response = await fetch(`/api/contracts?programId=${programId}`)
            if (response.ok) {
                const data = await response.json()
                setContracts(data)
            } else {
                throw new Error("Failed to fetch contracts")
            }
        } catch (error) {
            console.error("Error fetching contracts:", error)
            toast({
                title: "Error",
                description: "Failed to fetch contracts. Please try again.",
                variant: "destructive",
            })
        }
    }

    const fetchLaborCategories = async (contractId: string) => {
        try {
            const response = await fetch(`/api/labor-categories?contractId=${contractId}`)
            if (response.ok) {
                const data = await response.json()
                setLaborCategories(data)
            } else {
                throw new Error("Failed to fetch labor categories")
            }
        } catch (error) {
            console.error("Error fetching labor categories:", error)
            toast({
                title: "Error",
                description: "Failed to fetch labor categories. Please try again.",
                variant: "destructive",
            })
        }
    }

    const onSubmit = async (data: EmployeeFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, programId }),
            })

            if (!response.ok) {
                throw new Error("Failed to add employee")
            }

            toast({
                title: "Success",
                description: "Employee added successfully",
            })
            router.push(`/programs/${programId}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add employee. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Employee</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="position">Position</Label>
                        <Input id="position" {...register("position")} />
                        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" {...register("department")} />
                        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" {...register("startDate")} />
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="hourlyRate">Hourly Rate</Label>
                        <Input id="hourlyRate" type="number" step="0.01" {...register("hourlyRate", { valueAsNumber: true })} />
                        {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate.message}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPlanning"
                            checked={isPlanning}
                            onCheckedChange={(checked) => {
                                setIsPlanning(checked as boolean)
                                setValue("isPlanning", checked as boolean)
                            }}
                        />
                        <Label htmlFor="isPlanning">Planning (No contract assigned yet)</Label>
                    </div>
                    {!isPlanning && (
                        <>
                            <div>
                                <Label htmlFor="contractId">Contract</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedContract(value)
                                        setValue("contractId", value)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a contract" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contracts.map((contract) => (
                                            <SelectItem key={contract.id} value={contract.id}>
                                                {contract.contractNumber} - {contract.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.contractId && <p className="text-red-500 text-sm mt-1">{errors.contractId.message}</p>}
                            </div>
                            {selectedContract && (
                                <div>
                                    <Label htmlFor="laborCategoryId">Labor Category</Label>
                                    <Select onValueChange={(value) => setValue("laborCategoryId", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a labor category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {laborCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.laborCategoryId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.laborCategoryId.message}</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Employee"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

