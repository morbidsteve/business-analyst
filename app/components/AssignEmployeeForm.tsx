"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const assignEmployeeSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    role: z.string().min(1, "Role is required"),
    assignmentStart: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    billableRate: z.number().min(0, "Billable rate must be a positive number"),
    clearanceLevel: z.string().min(1, "Clearance level is required"),
})

type AssignEmployeeFormProps = {
    programId: string
    onClose: () => void
}

export function AssignEmployeeForm({ programId, onClose }: AssignEmployeeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([])
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof assignEmployeeSchema>>({
        resolver: zodResolver(assignEmployeeSchema),
        defaultValues: {
            employeeId: "",
            role: "",
            assignmentStart: "",
            billableRate: 0,
            clearanceLevel: "",
        },
    })

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("/api/employees")
                if (response.ok) {
                    const data = await response.json()
                    setEmployees(data)
                } else {
                    throw new Error("Failed to fetch employees")
                }
            } catch (error) {
                console.error("Error fetching employees:", error)
                toast({
                    title: "Error",
                    description: "Failed to fetch employees. Please try again.",
                    variant: "destructive",
                })
            }
        }

        fetchEmployees()
    }, [toast])

    const onSubmit = async (data: z.infer<typeof assignEmployeeSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/personnel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, programId }),
            })

            if (!response.ok) {
                throw new Error("Failed to assign employee")
            }

            toast({
                title: "Success",
                description: "Employee assigned successfully",
            })
            router.refresh()
            onClose()
        } catch (error) {
            console.error("Error assigning employee:", error)
            toast({
                title: "Error",
                description: "Failed to assign employee. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an employee" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {employees.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            {employee.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Input placeholder="Project Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="assignmentStart"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assignment Start Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="billableRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Billable Rate</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="clearanceLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Clearance Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select clearance level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="Confidential">Confidential</SelectItem>
                                    <SelectItem value="Secret">Secret</SelectItem>
                                    <SelectItem value="Top Secret">Top Secret</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Assigning..." : "Assign Employee"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

