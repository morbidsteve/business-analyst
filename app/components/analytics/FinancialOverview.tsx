"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"
import { useToast } from "@/components/ui/use-toast"

type FinancialOverviewProps = {
    programId: string
    chart: "burnRate" | "expenseVsBudget" | "obligationRate" | "revenueVsExpenses" | "profitMargin"
}

export function FinancialOverview({ programId, chart }: FinancialOverviewProps) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/program-analytics?programId=${programId}&chartType=${chart}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch data")
                }
                const result = await response.json()
                setData(result)
            } catch (error) {
                console.error("Error fetching data:", error)
                toast({
                    title: "Error",
                    description: "Failed to fetch chart data. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [programId, chart, toast])

    if (isLoading) {
        return <div>Loading chart data...</div>
    }

    const renderChart = () => {
        switch (chart) {
            case "burnRate":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="burnRate" stroke="#8884d8" name="Burn Rate" />
                        </LineChart>
                    </ResponsiveContainer>
                )
            case "expenseVsBudget":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="expense" fill="#8884d8" name="Expense" />
                            <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case "obligationRate":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="obligationRate" stroke="#8884d8" name="Obligation Rate (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                )
            case "revenueVsExpenses":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                            <Line type="monotone" dataKey="expenses" stroke="#8884d8" name="Expenses" />
                        </LineChart>
                    </ResponsiveContainer>
                )
            case "profitMargin":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="profitMargin" stroke="#82ca9d" name="Profit Margin (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                )
            default:
                return <div>Invalid chart type</div>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {chart.charAt(0).toUpperCase() +
                        chart
                            .slice(1)
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                </CardTitle>
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
        </Card>
    )
}

