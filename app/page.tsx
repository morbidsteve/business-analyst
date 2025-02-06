import { Suspense } from "react"
import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { DashboardContent } from "@/components/DashboardContent"

async function getHomeData() {
  const financialSummary = await prisma.$transaction(async (tx) => {
    const totalBudget = await tx.program.aggregate({
      _sum: { budget: true },
    })

    const totalExpenses = await tx.expense.aggregate({
      _sum: { amount: true },
    })

    const totalRevenue = await tx.financialData.aggregate({
      where: { type: "REVENUE" },
      _sum: { amount: true },
    })

    const laborCosts = await tx.laborCost.aggregate({
      _sum: { hours: true },
    })

    const averageHourlyRate = await tx.employee.aggregate({
      _avg: { hourlyRate: true },
    })

    const facilitiesCosts = await tx.facilitiesCost.aggregate({
      _sum: { amount: true },
    })

    return {
      totalBudget: totalBudget._sum.budget || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
      laborCosts: (laborCosts._sum.hours || 0) * (averageHourlyRate._avg.hourlyRate || 0),
      facilitiesCosts: facilitiesCosts._sum.amount || 0,
    }
  })

  const programs = await prisma.program.findMany({
    select: {
      id: true,
      name: true,
      budget: true,
      startDate: true,
      endDate: true,
    },
  })

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      program: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    financialSummary,
    programs: programs.map((program) => ({
      ...program,
      startDate: program.startDate.toISOString(),
      endDate: program.endDate ? program.endDate.toISOString() : null,
    })),
    projects: projects.map((project) => ({
      ...project,
      programName: project.program.name,
    })),
  }
}

export default async function Home() {
  const { financialSummary, programs, projects } = await getHomeData()

  return (
      <Layout title="Dashboard | Program Analyst">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Suspense fallback={<div>Loading dashboard content...</div>}>
          <DashboardContent financialSummary={financialSummary} programs={programs} projects={projects} />
        </Suspense>
      </Layout>
  )
}

