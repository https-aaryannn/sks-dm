import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800 transition-all hover:border-slate-700 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCard;