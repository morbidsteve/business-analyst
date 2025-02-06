"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addLaborCost } from "@/app/actions/laborCostActions"

const laborCostSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    hours: z.number().min(0, "Hours must be a positive number"),
})

type LaborCostFormData = z.infer<typeof laborCostSchema>

type Employee = {
    id: string
    name: string
    hourlyRate: number
}

type AddLaborCostFormProps = {
    programId: string
}

export function AddLaborCostForm({ programId }: AddLaborCostFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [employees, setEmployees] = useState<Employee[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<LaborCostFormData>({
        resolver: zodResolver(laborCostSchema),
    })

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch("/api/employees")
            const data = await response.json()
            setEmployees(data)
        }
        fetchEmployees()
    }, [])

    const onSubmit = async (data: LaborCostFormData) => {
        setIsSubmitting(true)
        try {
            await addLaborCost({ ...data, programId })
            toast({
                title: "Success",
                description: "Labor cost added successfully",
            })
            reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add labor cost. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees.find((emp) => emp.id === employeeId)
        setSelectedEmployee(employee || null)
        setValue("employeeId", employeeId)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Labor Cost</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="employeeId">Employee</Label>
                        <Select onValueChange={handleEmployeeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...register("date")} />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="hours">Hours Worked</Label>
                        <Input id="hours" type="number" step="0.5" {...register("hours", { valueAsNumber: true })} />
                        {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours.message}</p>}
                    </div>
                    {selectedEmployee && (
                        <div>
                            <Label>Hourly Rate</Label>
                            <Input type="number" value={selectedEmployee.hourlyRate} disabled />
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Labor Cost"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

