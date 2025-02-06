"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addFacilitiesCost } from "@/app/actions/facilitiesCostActions"

const facilitiesCostSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    description: z.string().min(1, "Description is required"),
})

type FacilitiesCostFormData = z.infer<typeof facilitiesCostSchema>

type AddFacilitiesCostFormProps = {
    programId: string
}

export function AddFacilitiesCostForm({ programId }: AddFacilitiesCostFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FacilitiesCostFormData>({
        resolver: zodResolver(facilitiesCostSchema),
    })

    const onSubmit = async (data: FacilitiesCostFormData) => {
        setIsSubmitting(true)
        try {
            await addFacilitiesCost({ ...data, programId })
            toast({
                title: "Success",
                description: "Facilities cost added successfully",
            })
            reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add facilities cost. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Facilities Cost</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...register("date")} />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Facilities Cost"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

