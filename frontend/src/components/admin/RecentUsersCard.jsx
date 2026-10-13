import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, ArrowUpRight, Clock } from 'lucide-react';

const ROLE_BADGES = {
  ADMIN: 'bg-pink-100 text-[#b7004d] border-pink-200',
  DROPSHIPPER: 'bg-purple-100 text-purple-800 border-purple-200',
  SUPPLIER: 'bg-amber-100 text-amber-800 border-amber-200',
  RESELLER: 'bg-blue-100 text-blue-800 border-blue-200',
  CUSTOMER: 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

export default function RecentUsersCard({ users = [], onNavigateTab, formatDate }) {
  return (
    <Card className="border border-gray-100 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Newly Registered
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Recent accounts created</p>
        </div>
        {onNavigateTab && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigateTab('users')}
            className="text-xs text-indigo-600 hover:bg-indigo-50 font-semibold"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4 divide-y divide-gray-100">
        {users.length > 0 ? (
          users.map((u) => (
            <div key={u.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 bg-pink-100 text-[#b7004d] text-xs font-bold shrink-0">
                  {u.avatarUrl ? (
                    <AvatarImage src={u.avatarUrl} alt={u.fullName} />
                  ) : (
                    <AvatarFallback>{(u.fullName || u.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {u.fullName || 'User'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {u.email}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_BADGES[u.role] || ROLE_BADGES.CUSTOMER}`}>
                  {u.role}
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center justify-end gap-1">
                  <Clock className="w-2.5 h-2.5" /> {formatDate ? formatDate(u.createdAt) : ''}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No users found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
