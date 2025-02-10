"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts"
import { useToast } from "@/components/ui/use-toast"

type ProjectProgressProps = {
    programId: string
    chart: "milestoneCompletion" | "projectStatus" | "ganttChart"
}

export function ProjectProgress({ programId, chart }: ProjectProgressProps) {
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
            case "milestoneCompletion":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="milestone" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completionPercentage" fill="#8884d8" name="Completion (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case "projectStatus":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="project" type="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completionPercentage" fill="#8884d8" name="Completion (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case "ganttChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis dataKey="task" type="category" />
                            <Tooltip />
                            <Legend />
                            {data.map((entry, index) => (
                                <Line
                                    key={index}
                                    dataKey="duration"
                                    data={[entry]}
                                    name={entry.task}
                                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                />
                            ))}
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

