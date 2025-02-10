"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'
import { useToast } from "@/components/ui/use-toast"

type OperationalMetricsProps = {
    programId: string
    chart: 'resourceUtilization' | 'employeeProductivity' | 'cycleTimeAnalysis'
}

export function OperationalMetrics({ programId, chart }: OperationalMetricsProps) {
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
            case 'resourceUtilization':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="resource" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="utilization" fill="#8884d8" name="Utilization (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case 'employeeProductivity':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid />
                            <XAxis dataKey="hoursWorked" name="Hours Worked" />
                            <YAxis dataKey="tasksCompleted" name="Tasks Completed" />
                            <ZAxis dataKey="employee" name="Employee" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Employee Productivity" data={data} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                )
            case 'cycleTimeAnalysis':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="process" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cycleTime" fill="#8884d8" name="Cycle Time (days)" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            default:
                return <div>Invalid chart type</div>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{chart.charAt(0).toUpperCase() + chart.slice(1).replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderChart()}
            </CardContent>
        </Card>
    )
}
