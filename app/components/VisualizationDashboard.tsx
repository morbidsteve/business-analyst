"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

type ChartData = {
    date: string
    budget: number
    actual: number
}

type Program = {
    id: string
    name: string
}

type CostCategory = {
    id: string
    name: string
}

export function VisualizationDashboard() {
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [programs, setPrograms] = useState<Program[]>([])
    const [costCategories, setCostCategories] = useState<CostCategory[]>([])
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPrograms()
        fetchCostCategories()
    }, [])

    useEffect(() => {
        fetchData()
    }, [selectedProgram, selectedCategory]) //This line was already correct.  The problem was described in the update but not actually present in the code.

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(
                `/api/dashboard-data?program=${selectedProgram || ""}&category=${selectedCategory || ""}`,
            )
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setChartData(data)
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error)
            setError("Failed to load dashboard data. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchPrograms = async () => {
        try {
            const response = await fetch("/api/programs")
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setPrograms(data)
        } catch (error) {
            console.error("Failed to fetch programs:", error)
            setError("Failed to load programs. Please try again later.")
        }
    }

    const fetchCostCategories = async () => {
        try {
            const response = await fetch("/api/cost-categories")
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            if (Array.isArray(data)) {
                setCostCategories(data)
            } else {
                console.error("Received non-array data for cost categories:", data)
                setCostCategories([])
            }
        } catch (error) {
            console.error("Failed to fetch cost categories:", error)
            setError("Failed to load cost categories. Please try again later.")
            setCostCategories([])
        }
    }

    const handleReset = () => {
        setSelectedProgram(null)
        setSelectedCategory(null)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Budget vs Actual Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 mb-4">
                    <Select
                        value={selectedProgram || ""}
                        onValueChange={(value) => {
                            setSelectedProgram(value)
                            fetchData()
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={programs.length ? "Select Program" : "Loading..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {programs.map((program) => (
                                <SelectItem key={program.id} value={program.id}>
                                    {program.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedCategory || ""}
                        onValueChange={(value) => {
                            setSelectedCategory(value)
                            fetchData()
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={costCategories.length ? "Select Cost Category" : "Loading..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {costCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-[400px]">Loading...</div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[400px] text-red-500">{error}</div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Budget" />
                            <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual Spending" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}

