"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FinancialOverview } from "./analytics/FinancialOverview"
import { OperationalMetrics } from "./analytics/OperationalMetrics"
import { ProjectProgress } from "./analytics/ProjectProgress"
import { RiskAssessment } from "./analytics/RiskAssessment"

type ProgramAnalyticsDashboardProps = {
    programId: string
}

export function ProgramAnalyticsDashboard({ programId }: ProgramAnalyticsDashboardProps) {
    const [selectedFinancialChart, setSelectedFinancialChart] = useState("burnRate")
    const [selectedOperationalChart, setSelectedOperationalChart] = useState("resourceUtilization")
    const [selectedProjectChart, setSelectedProjectChart] = useState("milestoneCompletion")
    const [selectedRiskChart, setSelectedRiskChart] = useState("riskMatrix")

    const financialCharts = [
        { value: "burnRate", label: "Burn Rate" },
        { value: "expenseVsBudget", label: "Expense vs Budget" },
        { value: "obligationRate", label: "Obligation Rate" },
        { value: "revenueVsExpenses", label: "Revenue vs Expenses" },
        { value: "profitMargin", label: "Profit Margin" },
    ]

    const operationalCharts = [
        { value: "resourceUtilization", label: "Resource Utilization" },
        { value: "employeeProductivity", label: "Employee Productivity" },
        { value: "cycleTimeAnalysis", label: "Cycle Time Analysis" },
    ]

    const projectCharts = [
        { value: "milestoneCompletion", label: "Milestone Completion" },
        { value: "projectStatus", label: "Project Status Overview" },
        { value: "ganttChart", label: "Gantt Chart" },
    ]

    const riskCharts = [
        { value: "riskMatrix", label: "Risk Matrix" },
        { value: "riskTrend", label: "Risk Trend" },
        { value: "issueTracker", label: "Issue Tracker" },
    ]

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Program Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="financial">
                    <TabsList>
                        <TabsTrigger value="financial">Financial</TabsTrigger>
                        <TabsTrigger value="operational">Operational</TabsTrigger>
                        <TabsTrigger value="project">Project Progress</TabsTrigger>
                        <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                    </TabsList>
                    <TabsContent value="financial">
                        <div className="mb-4">
                            <Select onValueChange={setSelectedFinancialChart} value={selectedFinancialChart}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a chart" />
                                </SelectTrigger>
                                <SelectContent>
                                    {financialCharts.map((chart) => (
                                        <SelectItem key={chart.value} value={chart.value}>
                                            {chart.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <FinancialOverview programId={programId} chart={selectedFinancialChart as any} />
                    </TabsContent>
                    <TabsContent value="operational">
                        <div className="mb-4">
                            <Select onValueChange={setSelectedOperationalChart} value={selectedOperationalChart}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a chart" />
                                </SelectTrigger>
                                <SelectContent>
                                    {operationalCharts.map((chart) => (
                                        <SelectItem key={chart.value} value={chart.value}>
                                            {chart.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <OperationalMetrics programId={programId} chart={selectedOperationalChart as any} />
                    </TabsContent>
                    <TabsContent value="project">
                        <div className="mb-4">
                            <Select onValueChange={setSelectedProjectChart} value={selectedProjectChart}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a chart" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projectCharts.map((chart) => (
                                        <SelectItem key={chart.value} value={chart.value}>
                                            {chart.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <ProjectProgress programId={programId} chart={selectedProjectChart as any} />
                    </TabsContent>
                    <TabsContent value="risk">
                        <div className="mb-4">
                            <Select onValueChange={setSelectedRiskChart} value={selectedRiskChart}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a chart" />
                                </SelectTrigger>
                                <SelectContent>
                                    {riskCharts.map((chart) => (
                                        <SelectItem key={chart.value} value={chart.value}>
                                            {chart.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <RiskAssessment programId={programId} chart={selectedRiskChart as any} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

