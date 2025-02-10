import Link from "next/link"
import type { Program } from "../types"

interface ProgramListProps {
    programs: Program[]
}

const ProgramList: React.FC<ProgramListProps> = ({ programs }) => {
    return (
        <ul>
            {programs.map((program) => (
                <li key={program.id}>
                    <Link href={`/programs/${program.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {program.name}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default ProgramList

