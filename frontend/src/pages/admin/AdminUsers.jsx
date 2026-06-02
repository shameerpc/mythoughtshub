import { useEffect, useMemo, useState } from "react";
import { Search, Shield, Trash2, User } from "lucide-react";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "../../api/admin.api";

const formatDate = (value) => value ? new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminUsers({ search });
      setUsers(response.response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => users, [users]);

  const changeRole = async (user, role) => {
    const response = await updateAdminUser(user._id, { role });
    setUsers((prev) => prev.map((item) => item._id === user._id ? response.result : item));
  };

  const remove = async (user) => {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    await deleteAdminUser(user._id);
    setUsers((prev) => prev.filter((item) => item._id !== user._id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage accounts and admin roles.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); loadUsers(); }} className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="h-10 rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white">Search</button>
        </form>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">{[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-100 p-2 text-slate-600"><User size={16} /></div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === "ADMIN" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-700"}`}>
                        {user.role === "ADMIN" && <Shield size={12} />} {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <select className="rounded-lg border border-slate-300 px-2 text-sm" value={user.role} onChange={(e) => changeRole(user, e.target.value)}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" onClick={() => remove(user)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
