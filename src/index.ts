import type { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import prisma from "../lib/prisma"
import FinancialSummary from "../components/FinancialSummary"
import ProgramOverview from "../components/ProgramOverview"
import ProjectStatus from "../components/ProjectStatus"

type HomeProps = {
    financialSummary: {
        totalBudget: number
        totalExpenses: number
        totalRevenue: number
    }
    programs: {
        id: string
        name: string
        budget: number
        startDate: string
        endDate: string | null
    }[]
    projects: {
        id: string
        name: string
        status: string
        programName: string
    }[]
}

export default function Home({ financialSummary, programs, projects }: HomeProps) {
    return (
        <Layout title="Dashboard | Program Analyst">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialSummary {...financialSummary} />
    <ProgramOverview programs={programs} />
    </div>
    <div className="mt-8">
    <ProjectStatus projects={projects} />
    </div>
    </Layout>
)
}

export const getServerSideProps: GetServerSideProps = async () => {
    const financialSummary = await prisma.$queryRaw`
    SELECT 
      SUM(p.budget) as totalBudget,
      SUM(CASE WHEN fd.type = 'EXPENSE' THEN fd.amount ELSE 0 END) as totalExpenses,
      SUM(CASE WHEN fd.type = 'REVENUE' THEN fd.amount ELSE 0 END) as totalRevenue
    FROM "Program" p
    LEFT JOIN "FinancialData" fd ON p.id = fd."programId"
  `

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
        props: {
            financialSummary: financialSummary[0],
            programs: programs.map((program) => ({
                ...program,
                startDate: program.startDate.toISOString(),
                endDate: program.endDate ? program.endDate.toISOString() : null,
            })),
            projects: projects.map((project) => ({
                ...project,
                programName: project.program.name,
            })),
        },
    }
}

