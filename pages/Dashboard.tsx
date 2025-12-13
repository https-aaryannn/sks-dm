import React, { useMemo } from 'react';
import {
  Users,
  CreditCard,
  Wallet,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import DashboardStatsCard from '../components/DashboardStatsCard';
import { Borrower } from '../types';

interface DashboardProps {
  borrowers: Borrower[];
}

const Dashboard: React.FC<DashboardProps> = ({ borrowers }) => {
  const stats = useMemo(() => {
    return borrowers.reduce(
      (acc, curr) => {
        acc.totalLent += curr.loanAmount;
        acc.totalRepaid += curr.repaidAmount;
        acc.totalOutstanding += (curr.totalPayable - curr.repaidAmount);
        if (curr.status === 'Active') acc.activeLoans += 1;
        return acc;
      },
      { totalLent: 0, totalRepaid: 0, totalOutstanding: 0, activeLoans: 0 }
    );
  }, [borrowers]);

  const pieData = [
    { name: 'Repaid', value: stats.totalRepaid },
    { name: 'Outstanding', value: stats.totalOutstanding },
  ];

  const COLORS = ['#10B981', '#F59E0B'];

  // Calculate monthly collection data
  const collectionData = useMemo(() => {
    const months: Record<string, number> = {};
    borrowers.forEach(b => {
      b.history.forEach(h => {
        const key = new Date(h.date).toLocaleString('default', { month: 'short' });
        months[key] = (months[key] || 0) + h.amount;
      });
    });

    return Object.entries(months).map(([name, amount]) => ({ name, amount }));
  }, [borrowers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatsCard
          title="Active Borrowers"
          value={stats.activeLoans}
          icon={Users}
          color="blue"
          trend={`${borrowers.length} Total Registered`}
        />
        <DashboardStatsCard
          title="Total Lent"
          value={`₹${stats.totalLent.toLocaleString()}`}
          icon={CreditCard}
          color="purple"
        />
        <DashboardStatsCard
          title="Total Repaid"
          value={`₹${stats.totalRepaid.toLocaleString()}`}
          icon={Wallet}
          color="green"
        />
        <DashboardStatsCard
          title="Outstanding Balance"
          value={`₹${stats.totalOutstanding.toLocaleString()}`}
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repayment Trend */}
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-xl shadow-sm border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4">Repayment History</h3>
          <div className="h-64">
            {collectionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">No repayment data available</div>
            )}
          </div>
        </div>

        {/* Portfolio Health */}
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-xl shadow-sm border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4">Portfolio Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;