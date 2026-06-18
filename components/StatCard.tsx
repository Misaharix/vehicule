interface StatCardProps {
  label: string;
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  icon?: string;
}

/**
 * Dashboard statistic card
 */
export function StatCard({ label, value, color = 'blue', icon }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const bgColor = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
        </div>
        {icon && (
          <div className={`${bgColor[color]} rounded-lg p-2 sm:p-3 text-xl sm:text-2xl flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
