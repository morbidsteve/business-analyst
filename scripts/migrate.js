const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Failed to execute command: ${command}`);
        process.exit(1);
    }
}

// Create the migration
runCommand('npx prisma migrate dev --create-only --name add_employee_and_update_relations');

// Find the latest migration file
const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
const migrations = fs.readdirSync(migrationsDir);
const latestMigration = migrations[migrations.length - 1];
const migrationFilePath = path.join(migrationsDir, latestMigration, 'migration.sql');

// Read the migration file
let migrationContent = fs.readFileSync(migrationFilePath, 'utf8');

// Modify the migration content
migrationContent = `
-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- Migrate existing Personnel data to Employee
INSERT INTO "Employee" (id, name, email, position, department, startDate, hourlyRate, createdAt, updatedAt)
SELECT id, name, CONCAT(name, '@example.com'), role, 'Migrated', startDate, hourlyRate, createdAt, updatedAt
FROM "Personnel";

-- Add employeeId column to Personnel
ALTER TABLE "Personnel" ADD COLUMN "employeeId" TEXT;

-- Update Personnel with corresponding Employee ids
UPDATE "Personnel" SET "employeeId" = id;

-- Add employeeId column to LaborCost
ALTER TABLE "LaborCost" ADD COLUMN "employeeId" TEXT;

-- Update LaborCost with corresponding Employee ids
UPDATE "LaborCost" SET "employeeId" = "personnelId";

-- Make columns required and add foreign key constraints
ALTER TABLE "Personnel" ALTER COLUMN "employeeId" SET NOT NULL;
ALTER TABLE "LaborCost" ALTER COLUMN "employeeId" SET NOT NULL;

ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LaborCost" ADD CONSTRAINT "LaborCost_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop columns from Personnel
ALTER TABLE "Personnel" DROP COLUMN "hourlyRate";
ALTER TABLE "Personnel" DROP COLUMN "name";
ALTER TABLE "Personnel" DROP COLUMN "role";

-- Create EmployeeHistoricalChange table
CREATE TABLE "EmployeeHistoricalChange" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeHistoricalChange_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint to EmployeeHistoricalChange
ALTER TABLE "EmployeeHistoricalChange" ADD CONSTRAINT "EmployeeHistoricalChange_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
`;

// Write the modified content back to the migration file
fs.writeFileSync(migrationFilePath, migrationContent);

// Apply the migration
runCommand('npx prisma migrate dev');

// Generate Prisma client
runCommand('npx prisma generate');

console.log('Migration completed successfully!');