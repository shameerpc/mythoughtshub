import React from "react";
// Ensure MessageSquare is imported here
import { Users, FileText, DollarSign, Bell, MessageSquare } from "lucide-react"; 

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Views</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">12,543</h3>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Blogs</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">45</h3>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <FileText size={24} />
          </div>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Affiliate Rev</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">$3,240</h3>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
        </div>
        {/* Stat Card 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">8</h3>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Bell size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            {/* MessageSquare used here */}
            <div className="p-2 bg-blue-50 rounded-full text-blue-600">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">New Comment on "React Tips"</p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 rounded-full text-green-600">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Affiliate Sale: $50.00</p>
              <p className="text-xs text-slate-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;