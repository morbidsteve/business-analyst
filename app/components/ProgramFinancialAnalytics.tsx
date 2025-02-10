"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useToast } from "@/components/ui/use-toast"

type FinancialData = {
    type: string
    amount: number
    date: string
}

type ChartData = {
    name: string
    Revenue: number
    Expenses: number
    "Budget Allocation": number
    Investment: number
}

type ProgramFinancialAnalyticsProps = {
    programId: string
}

export function ProgramFinancialAnalytics({ programId }: ProgramFinancialAnalyticsProps) {
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchFinancialData()
    }, []) // Removed programId from dependencies

    const fetchFinancialData = async () => {
        try {
            const response = await fetch(`/api/financial-data?programId=${programId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch financial data")
            }
            const data: FinancialData[] = await response.json()
            const processedData = processDataForChart(data)
            setChartData(processedData)
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

    const processDataForChart = (data: FinancialData[]): ChartData[] => {
        const groupedData: { [key: string]: ChartData } = {}

        data.forEach((item) => {
            const date = new Date(item.date)
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

            if (!groupedData[yearMonth]) {
                groupedData[yearMonth] = {
                    name: yearMonth,
                    Revenue: 0,
                    Expenses: 0,
                    "Budget Allocation": 0,
                    Investment: 0,
                }
            }

            switch (item.type) {
                case "REVENUE":
                    groupedData[yearMonth].Revenue += item.amount
                    break
                case "EXPENSE":
                    groupedData[yearMonth].Expenses += item.amount
                    break
                case "BUDGET_ALLOCATION":
                    groupedData[yearMonth]["Budget Allocation"] += item.amount
                    break
                case "INVESTMENT":
                    groupedData[yearMonth].Investment += item.amount
                    break
            }
        })

        return Object.values(groupedData).sort((a, b) => a.name.localeCompare(b.name))
    }

    if (isLoading) {
        return <div>Loading financial analytics...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Revenue" fill="#8884d8" />
                        <Bar dataKey="Expenses" fill="#82ca9d" />
                        <Bar dataKey="Budget Allocation" fill="#ffc658" />
                        <Bar dataKey="Investment" fill="#ff7300" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

