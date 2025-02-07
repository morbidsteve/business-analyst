# Program Analyst

## Project Overview

Program Analyst is a comprehensive web-based application designed to streamline program management, financial tracking, and resource allocation for organizations managing multiple programs and projects. This tool provides a centralized platform for program managers, financial analysts, and team leaders to efficiently monitor budgets, track expenses, manage personnel, and analyze program performance.

## Key Features

1. **Program Management**
    - Create and manage multiple programs
    - Track program budgets, start dates, and end dates
    - Monitor program status and progress

2. **Project Tracking**
    - Create and assign projects within programs
    - Track project budgets, timelines, and statuses
    - Customizable project status options

3. **Financial Management**
    - Real-time financial data tracking
    - Budget allocation and expense monitoring
    - Revenue and cost analysis
    - Detailed financial reporting

4. **Resource Management**
    - Employee database with roles and hourly rates
    - Assign employees to programs and projects
    - Track labor costs and work hours

5. **Expense Tracking**
    - Categorize and monitor various types of expenses
    - Track facilities costs
    - Generate expense reports

6. **Dashboard and Analytics**
    - Overview of program and project statuses
    - Financial summaries and visualizations
    - Performance metrics and KPIs

7. **Calendar Integration**
    - Program and project timeline visualization
    - Event scheduling and management

8. **Historical Data and Audit Trails**
    - Track changes to programs, projects, and employee data
    - Maintain historical records for analysis and auditing

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: (To be implemented)
- **State Management**: React Hooks
- **UI Components**: shadcn/ui
- **Calendar**: react-big-calendar
- **Form Handling**: react-hook-form, zod

## Setup Instructions

1. Clone the repository:
   \`\`\`
   git clone https://github.com/your-username/program-analyst.git
   cd program-analyst
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up the database:
    - Create a PostgreSQL database
    - Copy the \`.env.example\` file to \`.env\` and update the \`DATABASE_URL\` with your database connection string

4. Run database migrations:
   \`\`\`
   npx prisma migrate dev
   \`\`\`

5. Seed the database (optional):
   \`\`\`
   npm run seed
   \`\`\`

6. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

7. Open your browser and navigate to \`http://localhost:3000\`

## Usage Guidelines

1. **Dashboard**: The main dashboard provides an overview of all programs, their financial summaries, and project statuses.

2. **Programs**:
    - View all programs on the Programs page
    - Click on a program to view its details
    - Use the "Add New Program" button to create a new program

3. **Projects**:
    - Projects are managed within their respective programs
    - View and add projects from the program details page

4. **Employees**:
    - Manage employees from the Employees page
    - Add new employees and assign them to programs

5. **Financial Management**:
    - Track financial data for each program
    - Add expenses, labor costs, and facilities costs from the program management page

6. **Calendar**:
    - Use the calendar to visualize program and project timelines
    - Add and manage events directly from the calendar interface

7. **Settings**:
    - Customize project statuses
    - Manage database operations (for development purposes)

## Contributing

We welcome contributions to the Program Analyst project. Please read our CONTRIBUTING.md file (to be created) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

If you encounter any issues or have questions about using Program Analyst, please file an issue on the GitHub repository.

---

Thank you for using Program Analyst! We hope this tool helps streamline your program management processes and provides valuable insights into your projects and financial data.

