"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addInvoice } from "@/app/actions/invoiceActions"

const invoiceSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    description: z.string().min(1, "Description is required"),
    category: z.enum(["TRAVEL", "EQUIPMENT", "SUPPLIES", "SERVICES", "MISCELLANEOUS"]),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

type AddInvoiceFormProps = {
    programId: string
}

export function AddInvoiceForm({ programId }: AddInvoiceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
    })

    const onSubmit = async (data: InvoiceFormData) => {
        setIsSubmitting(true)
        try {
            await addInvoice({ ...data, programId })
            toast({
                title: "Success",
                description: "Invoice added successfully",
            })
            reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add invoice. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Invoice</CardTitle>
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
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => register("category").onChange({ target: { value } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TRAVEL">Travel</SelectItem>
                                <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                <SelectItem value="SUPPLIES">Supplies</SelectItem>
                                <SelectItem value="SERVICES">Services</SelectItem>
                                <SelectItem value="MISCELLANEOUS">Miscellaneous</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Invoice"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

