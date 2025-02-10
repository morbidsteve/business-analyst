#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if command was successful
check_success() {
    if [ $? -eq 0 ]; then
        print_color $GREEN "Success: $1"
    else
        print_color $RED "Error: $1 failed"
        exit 1
    fi
}

# Confirm with the user
print_color $YELLOW "This script will update your Prisma schema, generate migrations, and apply them to your database."
read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    print_color $YELLOW "Operation cancelled."
    exit 1
fi

# Step 1: Generate Prisma Client
print_color $YELLOW "Generating Prisma Client..."
npx prisma generate
check_success "Prisma Client generation"

# Step 2: Create a migration
print_color $YELLOW "Creating a new migration..."
read -p "Enter a name for this migration: " migration_name
npx prisma migrate dev --name $migration_name
check_success "Migration creation"

# Step 3: Apply migrations to the database
print_color $YELLOW "Applying migrations to the database..."
npx prisma migrate deploy
check_success "Migration deployment"

# Step 4: Verify database schema
print_color $YELLOW "Verifying database schema..."
npx prisma db pull
check_success "Database schema verification"

# Step 5: Generate Prisma Client again (to ensure it's up-to-date with the latest schema)
print_color $YELLOW "Regenerating Prisma Client..."
npx prisma generate
check_success "Prisma Client regeneration"

print_color $GREEN "Prisma schema update process completed successfully!"

