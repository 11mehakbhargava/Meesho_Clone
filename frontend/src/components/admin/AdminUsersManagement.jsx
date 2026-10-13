import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../utils/firebase';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from '../ui/dropdown-menu';
import { 
  Users, Search, Trash2, MoreVertical, 
  RefreshCw, Phone, Mail, Calendar 
} from 'lucide-react';
import { toast } from 'sonner';

const ROLES = ['ALL', 'CUSTOMER', 'SUPPLIER', 'RESELLER', 'DROPSHIPPER', 'DRIVER', 'ADMIN'];

const ROLE_COLORS = {
  ADMIN: 'bg-pink-100 text-[#b7004d] border-pink-200',
  SUPPLIER: 'bg-amber-100 text-amber-800 border-amber-200',
  RESELLER: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DROPSHIPPER: 'bg-purple-100 text-purple-800 border-purple-200',
  DRIVER: 'bg-blue-100 text-blue-800 border-blue-200',
  CUSTOMER: 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function AdminUsersManagement() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // 1. Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = (await auth.currentUser?.getIdToken()) || currentUser?.id;

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedRole !== 'ALL') params.role = selectedRole;

      const response = await axios.get('http://localhost:5000/api/v1/admin-users', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      toast.error("Failed to load users", {
        description: err.response?.data?.error || "Could not fetch user list."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedRole]);

  // 2. Change User Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoadingId(userId);
      const token = (await auth.currentUser?.getIdToken()) || currentUser?.id;

      const response = await axios.put(
        `http://localhost:5000/api/v1/admin-users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success("Role Updated", {
          description: `User role changed to ${newRole}`
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Role Update Failed", {
        description: err.response?.data?.error || "Failed to change role."
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. Delete User
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      setActionLoadingId(userId);
      const token = (await auth.currentUser?.getIdToken()) || currentUser?.id;

      const response = await axios.delete(
        `http://localhost:5000/api/v1/admin-users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User Deleted", {
          description: `${userName} has been removed from system.`
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete Failed", {
        description: err.response?.data?.error || "Failed to delete user."
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Top Filter Bar */}
      <Card className="shadow-sm border-gray-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#b7004d]/30"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
                Total: <strong className="text-gray-900">{users.length}</strong> Users
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loading}
                className="h-11 rounded-xl px-4 flex items-center gap-2 cursor-pointer hover:bg-pink-50 hover:text-[#b7004d]"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 no-scrollbar">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#b7004d] text-white shadow-sm shadow-pink-500/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {role === 'ALL' ? 'All Roles' : role}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50/75 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#b7004d]" />
                      <p className="text-sm font-medium">Loading user data...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-10 w-10 text-gray-300" />
                      <p className="text-base font-bold text-gray-700">No users found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search query or role filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleStyle = ROLE_COLORS[u.role] || ROLE_COLORS.CUSTOMER;
                  const isCurrentAdmin = u.id === currentUser?.id;
                  const joinFormatted = u.createdAt 
                    ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-pink-100 text-[#b7004d] font-bold">
                            {u.avatarUrl ? (
                              <AvatarImage src={u.avatarUrl} alt={u.fullName} className="object-cover" />
                            ) : (
                              <AvatarFallback>{(u.fullName || u.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              <span>{u.fullName || 'Anonymous User'}</span>
                              {isCurrentAdmin && (
                                <span className="text-[10px] font-bold bg-pink-100 text-[#b7004d] px-1.5 py-0.2 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 font-mono">UID: {u.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            <span>{u.email || 'No email registered'}</span>
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${roleStyle}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{joinFormatted}</span>
                        </div>
                      </td>

                      {/* Action Dropdown */}
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoadingId === u.id}
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100 rounded-lg"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                              Manage User Role
                            </DropdownMenuLabel>
                            
                            {ROLES.filter((r) => r !== 'ALL' && r !== u.role).map((r) => (
                              <DropdownMenuItem
                                key={r}
                                onClick={() => handleRoleChange(u.id, r)}
                                className="text-xs font-medium cursor-pointer"
                              >
                                Set as {r}
                              </DropdownMenuItem>
                            ))}

                            {!isCurrentAdmin && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(u.id, u.fullName || u.email)}
                                  className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-2"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
