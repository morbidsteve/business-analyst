"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const financialDataSchema = z.object({
    type: z.enum(["REVENUE", "EXPENSE", "BUDGET_ALLOCATION", "INVESTMENT"], {
        required_error: "Type is required",
    }),
    amount: z.number().positive("Amount must be positive"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    description: z.string().optional(),
})

type FinancialData = z.infer<typeof financialDataSchema>

type FinancialDataManagementProps = {
    programId: string
}

export function FinancialDataManagement({ programId }: FinancialDataManagementProps) {
    const [financialData, setFinancialData] = useState<FinancialData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FinancialData>({
        resolver: zodResolver(financialDataSchema),
        defaultValues: {
            type: undefined,
            amount: undefined,
            date: new Date().toISOString().split("T")[0],
            description: "",
        },
    })

    useEffect(() => {
        fetchFinancialData()
    }, []) // Removed programId from dependencies

    const fetchFinancialData = async () => {
        try {
            const response = await fetch(`/api/financial-data?programId=${programId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch financial data")
            }
            const data = await response.json()
            setFinancialData(data)
        } catch (error) {
            console.error("Error fetching financial data:", error)
            toast({
                title: "Error",
                description: "Failed to fetch financial data. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: FinancialData) => {
        try {
            const response = await fetch("/api/financial-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, programId }),
            })

            if (!response.ok) {
                throw new Error("Failed to add financial data")
            }

            toast({
                title: "Success",
                description: "Financial data added successfully",
            })
            reset()
            fetchFinancialData()
        } catch (error) {
            console.error("Error adding financial data:", error)
            toast({
                title: "Error",
                description: "Failed to add financial data. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div>Loading financial data...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Data Management</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REVENUE">Revenue</SelectItem>
                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                        <SelectItem value="BUDGET_ALLOCATION">Budget Allocation</SelectItem>
                                        <SelectItem value="INVESTMENT">Investment</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                    </div>
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
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input id="description" {...register("description")} />
                    </div>
                    <Button type="submit">Add Financial Data</Button>
                </form>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {financialData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>${item.amount.toFixed(2)}</TableCell>
                                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                <TableCell>{item.description || "N/A"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

