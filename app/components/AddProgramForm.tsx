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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addProgram } from "@/app/actions/programActions"

const programSchema = z.object({
    name: z.string().min(1, "Program name is required"),
    description: z.string().optional(),
    budget: z.number().min(0, "Budget must be a positive number"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    endDate: z
        .string()
        .refine((date) => date === "" || !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        })
        .optional(),
})

type ProgramFormData = z.infer<typeof programSchema>

export function AddProgramForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProgramFormData>({
        resolver: zodResolver(programSchema),
    })

    const onSubmit = async (data: ProgramFormData) => {
        setIsSubmitting(true)
        try {
            await addProgram(data)
            toast({
                title: "Success",
                description: "Program added successfully",
            })
            router.push("/programs")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add program. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Program</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Program Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                    </div>
                    <div>
                        <Label htmlFor="budget">Budget</Label>
                        <Input id="budget" type="number" step="0.01" {...register("budget", { valueAsNumber: true })} />
                        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
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
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Program"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

