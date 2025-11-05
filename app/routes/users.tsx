import type { Route } from "./+types/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import prisma from "prisma/prisma";

export async function loader() {
    // const response = await turso.execute("SELECT * FROM users")
    
    return {
        users: await prisma.user.findMany(),
    }
}

export default function ({ loaderData }: Route.ComponentProps) {
    const users = loaderData?.users || [];
    
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Age</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name || '-'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.age || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}