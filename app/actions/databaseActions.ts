"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

// Initialize PrismaClient
const prisma = new PrismaClient()

// Set up file logging
const logFilePath = path.join(process.cwd(), "database-seed.log")

function log(message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}${data ? " " + JSON.stringify(data, null, 2) : ""}\n`
    fs.appendFileSync(logFilePath, logMessage)
}

// Add event listener for Prisma events
prisma.$on("query", (e) => {
    log(`Query: ${e.query}`)
    log(`Params: ${e.params}`)
    log(`Duration: ${e.duration}ms`)
})

prisma.$on("info", (e) => {
    log(`Prisma Info: ${e.message}`)
})

prisma.$on("warn", (e) => {
    log(`Prisma Warning: ${e.message}`)
})

prisma.$on("error", (e) => {
    log(`Prisma Error: ${e.message}`)
})

export async function purgeDatabase() {
    try {
        log("Starting database purge")
        // Delete all records from all tables in the correct order to avoid foreign key constraints
        await prisma.$transaction([
            // Historical changes (no dependencies)
            prisma.employeeHistoricalChange.deleteMany(),
            prisma.facilitiesCostHistoricalChange.deleteMany(),
            prisma.laborCostHistoricalChange.deleteMany(),
            prisma.expenseHistoricalChange.deleteMany(),
            prisma.projectHistoricalChange.deleteMany(),
            prisma.personnelHistoricalChange.deleteMany(),
            prisma.financialDataHistoricalChange.deleteMany(),
            prisma.programHistoricalChange.deleteMany(),

            // Main tables
            prisma.facilitiesCost.deleteMany(),
            prisma.laborCost.deleteMany(),
            prisma.expense.deleteMany(),
            prisma.project.deleteMany(),
            prisma.personnel.deleteMany(),
            prisma.financialData.deleteMany(),
            prisma.employee.deleteMany(),
            prisma.program.deleteMany(),
            prisma.customProjectStatus.deleteMany(),
        ])

        log("Database purge completed successfully")
        revalidatePath("/")
        return { success: true, message: "Database purged successfully" }
    } catch (error) {
        log("Failed to purge database:", error)
        return {
            success: false,
            error: `Failed to purge database: ${error instanceof Error ? error.message : String(error)}`,
        }
    }
}

export async function seedDatabase() {
    log("Starting database seeding")
    try {
        const programsData = Array.from({ length: 5 }, (_, index) => ({
            name: `Program ${index + 1}`,
            description: `Description for Program ${index + 1}`,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            budget: Math.floor(Math.random() * 1000000) + 100000,
        }))

        const employeesData = Array.from({ length: 20 }, (_, index) => ({
            name: `Employee ${index + 1}`,
            email: `employee${index + 1}@example.com`,
            position: ["Software Engineer", "Project Manager", "Designer", "Analyst"][Math.floor(Math.random() * 4)],
            department: ["Engineering", "Management", "Design", "Analytics"][Math.floor(Math.random() * 4)],
            startDate: new Date(),
            hourlyRate: Math.floor(Math.random() * 50) + 50,
        }))

        log("Starting transaction")
        const result = await prisma.$transaction(async (tx) => {
            log("Creating programs")
            const createdPrograms = await Promise.all(
                programsData.map(async (program) => {
                    log("Creating program", program)
                    return await tx.program.create({ data: program })
                }),
            )
            log("Programs created", { count: createdPrograms.length })

            log("Creating employees")
            const createdEmployees = await Promise.all(
                employeesData.map(async (employee) => {
                    log(`Creating employee`, employee)
                    return await tx.employee.create({ data: employee })
                }),
            )
            log("Employees created", { count: createdEmployees.length })

            log("Creating personnel")
            const createdPersonnel = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 3 }, async () => {
                        const employee = createdEmployees[Math.floor(Math.random() * createdEmployees.length)]
                        return await tx.personnel.create({
                            data: {
                                programId: program.id,
                                employeeId: employee.id,
                                startDate: new Date(),
                            },
                        })
                    }),
                ),
            )
            log("Personnel created", { count: createdPersonnel.length })

            log("Creating projects")
            const createdProjects = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 2 }, async () => {
                        return await tx.project.create({
                            data: {
                                programId: program.id,
                                name: `Project for ${program.name}`,
                                description: `A project under ${program.name}`,
                                startDate: new Date(),
                                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                                budget: Math.floor(Math.random() * 500000) + 50000,
                                status: ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"][Math.floor(Math.random() * 4)],
                            },
                        })
                    }),
                ),
            )
            log("Projects created", { count: createdProjects.length })

            log("Creating financial data")
            const createdFinancialData = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 5 }, async () => {
                        return await tx.financialData.create({
                            data: {
                                programId: program.id,
                                type: ["REVENUE", "EXPENSE", "BUDGET_ALLOCATION", "INVESTMENT"][Math.floor(Math.random() * 4)],
                                amount: Math.floor(Math.random() * 100000) + 10000,
                                date: new Date(),
                                description: `Financial entry for ${program.name}`,
                            },
                        })
                    }),
                ),
            )
            log("Financial data created", { count: createdFinancialData.length })

            log("Creating expenses")
            const createdExpenses = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 5 }, async () => {
                        return await tx.expense.create({
                            data: {
                                programId: program.id,
                                amount: Math.floor(Math.random() * 10000) + 1000,
                                date: new Date(),
                                description: `Expense for ${program.name}`,
                                category: ["TRAVEL", "EQUIPMENT", "SUPPLIES", "SERVICES", "MISCELLANEOUS"][
                                    Math.floor(Math.random() * 5)
                                    ],
                            },
                        })
                    }),
                ),
            )
            log("Expenses created", { count: createdExpenses.length })

            log("Creating labor costs")
            const createdLaborCosts = await Promise.all(
                createdPersonnel.flatMap((personnel) =>
                    Array.from({ length: 5 }, async () => {
                        return await tx.laborCost.create({
                            data: {
                                programId: personnel.programId,
                                personnelId: personnel.id,
                                employeeId: personnel.employeeId,
                                hours: Math.floor(Math.random() * 40) + 10,
                                date: new Date(),
                            },
                        })
                    }),
                ),
            )
            log("Labor costs created", { count: createdLaborCosts.length })

            log("Creating facilities costs")
            const createdFacilitiesCosts = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 2 }, async () => {
                        return await tx.facilitiesCost.create({
                            data: {
                                programId: program.id,
                                amount: Math.floor(Math.random() * 5000) + 1000,
                                date: new Date(),
                                description: `Facilities cost for ${program.name}`,
                            },
                        })
                    }),
                ),
            )
            log("Facilities costs created", { count: createdFacilitiesCosts.length })

            log("Creating custom project statuses")
            const customStatuses = [
                { name: "At Risk", color: "#FFA500" },
                { name: "Ahead of Schedule", color: "#008000" },
                { name: "Delayed", color: "#FF0000" },
            ]
            const createdCustomStatuses = await Promise.all(
                customStatuses.map(async (status) => {
                    return await tx.customProjectStatus.create({
                        data: status,
                    })
                }),
            )
            log("Custom project statuses created", { count: createdCustomStatuses.length })

            return {
                programs: createdPrograms,
                employees: createdEmployees,
                personnel: createdPersonnel,
                projects: createdProjects,
                financialData: createdFinancialData,
                expenses: createdExpenses,
                laborCosts: createdLaborCosts,
                facilitiesCosts: createdFacilitiesCosts,
                customProjectStatuses: createdCustomStatuses,
            }
        })

        log("Database seeding completed successfully", result)
        revalidatePath("/")
        return { success: true, message: "Database seeded successfully with comprehensive data" }
    } catch (error) {
        log("Failed to seed database:", error)
        return {
            success: false,
            error: `Failed to seed database: ${error instanceof Error ? error.message : String(error)}`,
        }
    } finally {
        await prisma.$disconnect()
    }
}

