import { useLoaderData } from "react-router";

export function TasksList() {
  const data = useLoaderData<typeof loader>();
  
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users from Database</h2>
      {data.users.length === 0 ? (
        <p className="text-gray-500">No users found in the database.</p>
      ) : (
        <div className="space-y-2">
          {data.users.map((user: any) => (
            <div key={user.id} className="border rounded-md p-3">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {user.created_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}