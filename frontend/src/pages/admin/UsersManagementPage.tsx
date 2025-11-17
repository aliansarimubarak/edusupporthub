import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin";
import type { User } from "../../api/auth";

const UsersManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    AdminAPI.users().then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Users management
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        View all registered students, experts, and admins.
      </p>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-3 text-xs text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagementPage;
