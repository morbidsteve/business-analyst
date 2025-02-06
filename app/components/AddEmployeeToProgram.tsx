"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

type Employee = {
    id: string
    name: string
    email: string
}

type AddEmployeeToProgramProps = {
    programId: string
}

export function AddEmployeeToProgram({ programId }: AddEmployeeToProgramProps) {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch("/api/employees")
            const data = await response.json()
            setEmployees(data)
        }
        fetchEmployees()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEmployee) return

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/personnel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    programId,
                    employeeId: selectedEmployee,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to add employee to program")
            }

            toast({
                title: "Success",
                description: "Employee added to program successfully",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add employee to program. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Existing Employee to Program</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Select onValueChange={(value) => setSelectedEmployee(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                    {employee.name} ({employee.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting || !selectedEmployee}>
                        {isSubmitting ? "Adding..." : "Add to Program"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

