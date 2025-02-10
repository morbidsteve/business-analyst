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

            // Audit logs
            prisma.auditLog.deleteMany(),

            // Contract-related entities
            prisma.subcontractorAssignment.deleteMany(),
            prisma.subcontractingGoal.deleteMany(),
            prisma.subcontractor.deleteMany(),
            prisma.laborCategory.deleteMany(),
            prisma.modification.deleteMany(),
            prisma.invoice.deleteMany(),
            prisma.task.deleteMany(),
            prisma.contract.deleteMany(),

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
            prisma.agency.deleteMany(),
            prisma.contractType.deleteMany(),
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
        const programsData = [
            {
                name: "Next-Gen Satellite Communication",
                description: "Developing advanced satellite communication systems for global connectivity",
                startDate: new Date("2023-01-01"),
                endDate: new Date("2026-12-31"),
                budget: 750000000,
            },
            {
                name: "Quantum Computing Research",
                description: "Exploring quantum computing applications for cryptography and optimization problems",
                startDate: new Date("2023-03-15"),
                endDate: new Date("2027-03-14"),
                budget: 500000000,
            },
            {
                name: "Sustainable Energy Solutions",
                description: "Researching and developing renewable energy technologies for a sustainable future",
                startDate: new Date("2023-06-01"),
                endDate: new Date("2028-05-31"),
                budget: 1000000000,
            },
        ]

        const employeesData = [
            {
                name: "Dr. Emily Chen",
                email: "emily.chen@example.com",
                position: "Lead Researcher",
                department: "R&D",
                startDate: new Date("2020-03-01"),
                hourlyRate: 75,
            },
            {
                name: "Michael Johnson",
                email: "michael.johnson@example.com",
                position: "Project Manager",
                department: "Operations",
                startDate: new Date("2019-07-15"),
                hourlyRate: 65,
            },
            {
                name: "Sarah Williams",
                email: "sarah.williams@example.com",
                position: "Software Engineer",
                department: "IT",
                startDate: new Date("2021-01-10"),
                hourlyRate: 60,
            },
            {
                name: "David Rodriguez",
                email: "david.rodriguez@example.com",
                position: "Financial Analyst",
                department: "Finance",
                startDate: new Date("2022-04-01"),
                hourlyRate: 55,
            },
            {
                name: "Lisa Thompson",
                email: "lisa.thompson@example.com",
                position: "HR Specialist",
                department: "Human Resources",
                startDate: new Date("2020-09-01"),
                hourlyRate: 50,
            },
        ]

        const agenciesData = [
            {
                name: "Department of Defense",
                department: "DOD",
                address: "1400 Defense Pentagon, Washington, DC 20301-1400",
                paymentOffice: "DFAS",
            },
            {
                name: "Department of Energy",
                department: "DOE",
                address: "1000 Independence Ave., SW, Washington, DC 20585",
                paymentOffice: "Energy IPP",
            },
            {
                name: "National Aeronautics and Space Administration",
                department: "NASA",
                address: "300 E Street SW, Washington, DC 20546",
                paymentOffice: "NASA NSSC",
            },
            {
                name: "Department of Homeland Security",
                department: "DHS",
                address: "245 Murray Lane SW, Washington, DC 20528",
                paymentOffice: "DHS IPP",
            },
            {
                name: "Environmental Protection Agency",
                department: "EPA",
                address: "1200 Pennsylvania Avenue, N.W., Washington, DC 20460",
                paymentOffice: "EPA IPP",
            },
            {
                name: "Department of Health and Human Services",
                department: "HHS",
                address: "200 Independence Avenue, S.W., Washington, DC 20201",
                paymentOffice: "HHS Payment",
            },
            {
                name: "Department of Veterans Affairs",
                department: "VA",
                address: "810 Vermont Avenue, NW, Washington, DC 20420",
                paymentOffice: "VA FSC",
            },
            {
                name: "National Science Foundation",
                department: "NSF",
                address: "2415 Eisenhower Avenue, Alexandria, VA 22314",
                paymentOffice: "NSF IPP",
            },
        ]

        const contractTypesData = [
            { name: "Firm Fixed Price (FFP)", category: "Fixed Price", billingRequirements: "Set price for defined scope" },
            {
                name: "Cost Plus Fixed Fee (CPFF)",
                category: "Cost Reimbursement",
                billingRequirements: "Actual costs plus fixed fee percentage",
            },
            {
                name: "Time and Materials (TM)",
                category: "Time & Materials",
                billingRequirements: "Fixed labor rates plus materials at cost",
            },
            {
                name: "Indefinite Delivery Indefinite Quantity (IDIQ)",
                category: "Indefinite Delivery",
                billingRequirements: "Framework for future task/delivery orders",
            },
            {
                name: "Fixed Price Incentive (FPI)",
                category: "Fixed Price",
                billingRequirements: "Base profit with incentives for meeting targets",
            },
            {
                name: "Cost Plus Incentive Fee (CPIF)",
                category: "Cost Reimbursement",
                billingRequirements: "Actual costs plus variable fee based on objectives",
            },
            { name: "Labor Hour (LH)", category: "Time & Materials", billingRequirements: "Fixed labor rates only" },
            {
                name: "Performance Based Logistics (PBL)",
                category: "Other",
                billingRequirements: "Based on performance outcomes",
            },
        ]

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

            log("Creating agencies")
            const createdAgencies = await Promise.all(
                agenciesData.map(async (agency) => {
                    log(`Creating agency`, agency)
                    return await tx.agency.create({ data: agency })
                }),
            )
            log("Agencies created", { count: createdAgencies.length })

            log("Creating contract types")
            const createdContractTypes = await Promise.all(
                contractTypesData.map(async (contractType) => {
                    log(`Creating contract type`, contractType)
                    return await tx.contractType.create({ data: contractType })
                }),
            )
            log("Contract types created", { count: createdContractTypes.length })

            log("Creating contracts")
            const createdContracts = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 2 }, async () => {
                        const agency = createdAgencies[Math.floor(Math.random() * createdAgencies.length)]
                        const contractType = createdContractTypes[Math.floor(Math.random() * createdContractTypes.length)]
                        return await tx.contract.create({
                            data: {
                                programId: program.id,
                                agencyId: agency.id,
                                contractTypeId: contractType.id,
                                contractNumber: `CTR-${Math.floor(Math.random() * 10000)}`,
                                title: `Contract for ${program.name}`,
                                startDate: new Date(),
                                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
                                totalValue: Math.floor(Math.random() * 100000000) + 10000000,
                                fundedValue: Math.floor(Math.random() * 50000000) + 5000000,
                                status: ["Active", "Pending", "Completed"][Math.floor(Math.random() * 3)],
                                contractingOfficer: ["John Smith", "Jane Doe", "Robert Johnson"][Math.floor(Math.random() * 3)],
                                corName: ["Alice Brown", "Charlie Davis", "Eva Wilson"][Math.floor(Math.random() * 3)],
                                securityClearanceReq: ["Secret", "Top Secret", "Confidential"][Math.floor(Math.random() * 3)],
                                performanceLocation: ["Washington D.C.", "Houston, TX", "Palo Alto, CA"][Math.floor(Math.random() * 3)],
                                naicsCode: ["541330", "541715", "541990"][Math.floor(Math.random() * 3)],
                                isClassified: Math.random() < 0.3,
                                smallBusinessGoalPct: Math.floor(Math.random() * 30) + 10,
                            },
                        })
                    }),
                ),
            )
            log("Contracts created", { count: createdContracts.length })

            log("Creating labor categories")
            const createdLaborCategories = await Promise.all(
                createdContracts.flatMap((contract) =>
                    Array.from({ length: 3 }, async () => {
                        return await tx.laborCategory.create({
                            data: {
                                contractId: contract.id,
                                title: ["Senior Engineer", "Project Manager", "Research Scientist"][Math.floor(Math.random() * 3)],
                                description: "Skilled professional for contract execution",
                                minRate: Math.floor(Math.random() * 50) + 50,
                                maxRate: Math.floor(Math.random() * 100) + 100,
                                educationReq: ["Bachelor's", "Master's", "PhD"][Math.floor(Math.random() * 3)],
                                experienceReq: `${Math.floor(Math.random() * 10) + 2} years`,
                                clearanceReq: ["Secret", "Top Secret", "Confidential"][Math.floor(Math.random() * 3)],
                                active: Math.random() < 0.9,
                            },
                        })
                    }),
                ),
            )
            log("Labor categories created", { count: createdLaborCategories.length })

            log("Creating personnel")
            const createdPersonnel = await Promise.all(
                createdPrograms.flatMap((program) =>
                    Array.from({ length: 3 }, async () => {
                        const employee = createdEmployees[Math.floor(Math.random() * createdEmployees.length)]
                        const contract = createdContracts.find((c) => c.programId === program.id)
                        const laborCategory = createdLaborCategories.find((lc) => lc.contractId === contract?.id)
                        return await tx.personnel.create({
                            data: {
                                programId: program.id,
                                employeeId: employee.id,
                                contractId: contract?.id,
                                laborCategoryId: laborCategory?.id,
                                startDate: new Date(),
                                role: ["Project Lead", "Senior Researcher", "Technical Specialist"][Math.floor(Math.random() * 3)],
                                assignmentStart: new Date(),
                                billableRate: employee.hourlyRate * 2.5,
                                clearanceLevel: ["Secret", "Top Secret", "Confidential"][Math.floor(Math.random() * 3)],
                                currentStatus: true,
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
                                name: `${program.name} - Phase ${Math.floor(Math.random() * 3) + 1}`,
                                description: `A key project under the ${program.name} program`,
                                startDate: new Date(),
                                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
                                budget: Math.floor(Math.random() * 10000000) + 5000000,
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
                                amount: Math.floor(Math.random() * 10000000) + 1000000,
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
                                amount: Math.floor(Math.random() * 500000) + 50000,
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
                                hours: Math.floor(Math.random() * 40) + 20,
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
                                amount: Math.floor(Math.random() * 100000) + 10000,
                                date: new Date(),
                                description: `Facilities cost for ${program.name}`,
                            },
                        })
                    }),
                ),
            )
            log("Facilities costs created", { count: createdFacilitiesCosts.length })

            log("Creating tasks")
            const createdTasks = await Promise.all(
                createdContracts.flatMap((contract) =>
                    Array.from({ length: 3 }, async () => {
                        return await tx.task.create({
                            data: {
                                contractId: contract.id,
                                description: `Task for ${contract.title}`,
                                dueDate: new Date(new Date().setMonth(new Date().getMonth() + Math.floor(Math.random() * 12))),
                                status: ["Not Started", "In Progress", "Completed"][Math.floor(Math.random() * 3)],
                                estimatedHours: Math.floor(Math.random() * 100) + 20,
                                deliverableFormat: ["Report", "Presentation", "Software", "Hardware"][Math.floor(Math.random() * 4)],
                            },
                        })
                    }),
                ),
            )
            log("Tasks created", { count: createdTasks.length })

            log("Creating invoices")
            const createdInvoices = await Promise.all(
                createdContracts.flatMap((contract) =>
                    Array.from({ length: 4 }, async () => {
                        return await tx.invoice.create({
                            data: {
                                contractId: contract.id,
                                invoiceDate: new Date(),
                                amount: Math.floor(Math.random() * 1000000) + 100000,
                                status: ["Submitted", "Approved", "Paid"][Math.floor(Math.random() * 3)],
                                submissionDate: new Date(),
                                paymentDate: Math.random() < 0.7 ? new Date(new Date().setDate(new Date().getDate() + 30)) : null,
                                paymentTerms: "Net 30",
                                invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
                            },
                        })
                    }),
                ),
            )
            log("Invoices created", { count: createdInvoices.length })

            log("Creating modifications")
            const createdModifications = await Promise.all(
                createdContracts.flatMap((contract) =>
                    Array.from({ length: 2 }, async () => {
                        return await tx.modification.create({
                            data: {
                                contractId: contract.id,
                                modNumber: `MOD-${Math.floor(Math.random() * 100)}`,
                                effectiveDate: new Date(),
                                valueChange: Math.floor(Math.random() * 1000000) - 500000,
                                description: `Modification to ${contract.title}`,
                                status: ["Pending", "Approved", "Implemented"][Math.floor(Math.random() * 3)],
                            },
                        })
                    }),
                ),
            )
            log("Modifications created", { count: createdModifications.length })

            log("Creating subcontracting goals")
            const createdSubcontractingGoals = await Promise.all(
                createdContracts.flatMap((contract) =>
                    Array.from({ length: 2 }, async () => {
                        return await tx.subcontractingGoal.create({
                            data: {
                                contractId: contract.id,
                                businessType: ["Small Business", "Woman-Owned", "Veteran-Owned"][Math.floor(Math.random() * 3)],
                                goalPercentage: Math.floor(Math.random() * 20) + 5,
                                currentPercentage: Math.floor(Math.random() * 15),
                                goalAmount: Math.floor(Math.random() * 1000000) + 100000,
                                currentAmount: Math.floor(Math.random() * 500000) + 50000,
                                reportPeriod: new Date(),
                            },
                        })
                    }),
                ),
            )
            log("Subcontracting goals created", { count: createdSubcontractingGoals.length })

            log("Creating subcontractors")
            const createdSubcontractors = await Promise.all(
                Array.from({ length: 5 }, async () => {
                    return await tx.subcontractor.create({
                        data: {
                            name: [
                                "TechInnovate Solutions",
                                "GlobalComm Systems",
                                "EcoEnergy Innovations",
                                "DataSmart Analytics",
                                "NanoTech Fabricators",
                            ][Math.floor(Math.random() * 5)],
                            dunsNumber: `${Math.floor(Math.random() * 1000000000)}`.padStart(9, "0"),
                            cageCode: `${Math.floor(Math.random() * 100000)}`.padStart(5, "0"),
                            businessSize: ["Small", "Large"][Math.floor(Math.random() * 2)],
                            businessTypes: ["Woman-Owned", "Veteran-Owned", "HUBZone", "8(a)"][Math.floor(Math.random() * 4)],
                            active: Math.random() < 0.9,
                        },
                    })
                }),
            )
            log("Subcontractors created", { count: createdSubcontractors.length })

            log("Creating subcontractor assignments")
            const createdSubcontractorAssignments = await Promise.all(
                createdContracts.flatMap((contract) =>
                    Array.from({ length: 2 }, async () => {
                        const subcontractor = createdSubcontractors[Math.floor(Math.random() * createdSubcontractors.length)]
                        return await tx.subcontractorAssignment.create({
                            data: {
                                contractId: contract.id,
                                subcontractorId: subcontractor.id,
                                startDate: new Date(),
                                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                                plannedValue: Math.floor(Math.random() * 1000000) + 100000,
                                currentValue: Math.floor(Math.random() * 500000) + 50000,
                                status: ["Active", "Completed", "Terminated"][Math.floor(Math.random() * 3)],
                            },
                        })
                    }),
                ),
            )
            log("Subcontractor assignments created", { count: createdSubcontractorAssignments.length })

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
                agencies: createdAgencies,
                contractTypes: createdContractTypes,
                personnel: createdPersonnel,
                projects: createdProjects,
                financialData: createdFinancialData,
                expenses: createdExpenses,
                laborCosts: createdLaborCosts,
                facilitiesCosts: createdFacilitiesCosts,
                contracts: createdContracts,
                tasks: createdTasks,
                invoices: createdInvoices,
                modifications: createdModifications,
                laborCategories: createdLaborCategories,
                subcontractingGoals: createdSubcontractingGoals,
                subcontractors: createdSubcontractors,
                subcontractorAssignments: createdSubcontractorAssignments,
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

