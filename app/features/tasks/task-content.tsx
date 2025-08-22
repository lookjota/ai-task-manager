import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { CheckCircle2, ListTodo, TestTube2 } from "lucide-react"

export function TaskContent() {
    const taskData = {
        "title": "Secure Login Form with Authentication",
        "description": "Implement a modern login form with field validation, session-based authentication, and real-time error feedback.",
        "estimated_time": "2 days",
        "steps": [
            "Create a form component using React",
            "Add field validation using a suitable library",
            "Connect backend for user authentication",
            "Persist sessions using SQLite",
            "Test full login and logout flow"
        ],
        "suggested_tests": [
            "it('should render login form correctly')",
            "it('should validate input fields')",
            "it('should authenticate valid credentials')",
            "it('should prevent access with invalid credentials')"
        ],
        "acceptance_criteria": [
            "Login form displays properly with required fields",
            "Invalid input is correctly flagged",
            "Valid users can log in and maintain a session",
            "Users are redirected upon login and logout"
        ],
        "implementation_suggestion": "Use React Hook Form for input validation, Prisma ORM for managing user data, and configure protected routes using React Router 7."
    }

    const sections = [
        {
            title: "Steps",
            icon: ListTodo,
            content: taskData.steps,
        },
        {
            title: "Suggested Tests",
            icon: TestTube2,
            content: taskData.suggested_tests,
        },
        {
            title: "Acceptance Criteria",
            icon: CheckCircle2,
            content: taskData.acceptance_criteria,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            <section.icon className="h-4 w-4 text-muted-foreground inline-block mr-2" />
                            {section.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5">
                            {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-sm text-muted-foreground">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}