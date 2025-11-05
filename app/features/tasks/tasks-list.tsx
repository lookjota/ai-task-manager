import { useLoaderData } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type LoaderData = {
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    steps: string | null;
    estimated_time: string;
    implementation_suggestion: string | null;
    acceptance_criteria: string | null;
    suggested_tests: string | null;
    content: string | null;
    chat_history: any;
    created_at: Date;
    updated_at: Date;
  }>;
  success: boolean;
  error?: string;
};

export function TasksList() {
  const data = useLoaderData<LoaderData>();
  
  if (!data.success) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Database Connection Error</h3>
          <p className="text-red-600 mt-1">{data.error}</p>
        </div>
      </div>
    );
  }

  const tasks = data.tasks || [];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found in the database.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Estimated Time</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono text-xs">{task.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="max-w-md truncate">{task.description}</TableCell>
                    <TableCell>{task.estimated_time}</TableCell>
                    <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(task.updated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}