"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    position: z.string().min(1, "Position is required"),
    department: z.string().min(1, "Department is required"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    endDate: z
        .string()
        .refine((date) => date === "" || !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        })
        .optional(),
    hourlyRate: z.number().min(0, "Hourly rate must be a positive number"),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

export function AddEmployeeForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
    })

    const onSubmit = async (data: EmployeeFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to add employee")
            }

            toast({
                title: "Success",
                description: "Employee added successfully",
            })
            router.push("/employees")
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
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input id="endDate" type="date" {...register("endDate")} />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="hourlyRate">Hourly Rate</Label>
                        <Input id="hourlyRate" type="number" step="0.01" {...register("hourlyRate", { valueAsNumber: true })} />
                        {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate.message}</p>}
                    </div>
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

