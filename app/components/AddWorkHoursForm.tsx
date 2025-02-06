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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addWorkHours } from "@/app/actions/workHoursActions"

const workHoursSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    programId: z.string().min(1, "Program is required"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    hours: z.number().min(0, "Hours must be a positive number"),
})

type WorkHoursFormData = z.infer<typeof workHoursSchema>

type AddWorkHoursFormProps = {
    programId: string
}

export function AddWorkHoursForm({ programId }: AddWorkHoursFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<WorkHoursFormData>({
        resolver: zodResolver(workHoursSchema),
    })

    const onSubmit = async (data: WorkHoursFormData) => {
        setIsSubmitting(true)
        try {
            await addWorkHours({ ...data, programId })
            toast({
                title: "Success",
                description: "Work hours added successfully",
            })
            reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add work hours. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Work Hours</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="employeeId">Employee</Label>
                        <Select onValueChange={(value) => register("employeeId").onChange({ target: { value } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* We'll need to fetch employees and map them here */}
                                <SelectItem value="employee1">Employee 1</SelectItem>
                                <SelectItem value="employee2">Employee 2</SelectItem>
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
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Work Hours"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

