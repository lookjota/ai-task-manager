import prisma from "prisma/prisma";
import { TasksList } from "~/features/tasks/tasks-list"
// import { turso } from "~/turso";

export async function loader() {
  try {
    console.log("Attempting to connect to Turso database...");
    
    // Test database connection and get users
    // const result = await turso.execute("SELECT * FROM users LIMIT 5");
    
    // console.log("Database connection successful, found users:", result.rows.length);
    
    return {
      tasks: await prisma.task.findMany({ include: { author: true } }),
      users: await prisma.user.findMany(),
      success: true
    };
  } catch (error) {
    console.error("Database connection error:", error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return {
      tasks: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export default function Tasks() {
  return <TasksList />
}