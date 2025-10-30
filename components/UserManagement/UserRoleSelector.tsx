'use client';

interface RoleInfo {
  value: 'ADMIN' | 'WORKER' | 'CLIENT';
  label: string;
  description: string;
  badge: string;
}

const ROLES: RoleInfo[] = [
  {
    value: 'ADMIN',
    label: 'Administrator',
    description: 'Full access to all system features, user management, and configuration',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  {
    value: 'WORKER',
    label: 'Worker',
    description: 'Manage rooms, products, and room assignments. Can update user profiles.',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    value: 'CLIENT',
    label: 'Client',
    description: 'Basic access to assigned room and product purchases',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
];

interface UserRoleSelectorProps {
  currentRole: 'ADMIN' | 'WORKER' | 'CLIENT';
  onChange: (role: 'ADMIN' | 'WORKER' | 'CLIENT') => void;
  disabled?: boolean;
}

export default function UserRoleSelector({ currentRole, onChange, disabled }: UserRoleSelectorProps) {
  return (
    <div className="space-y-3">
      {ROLES.map((role) => (
        <label
          key={role.value}
          className={`flex cursor-pointer items-start space-x-3 rounded-lg border-2 p-4 transition-all ${
            currentRole === role.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <input
            type="radio"
            name="role"
            value={role.value}
            checked={currentRole === role.value}
            onChange={(e) => onChange(e.target.value as 'ADMIN' | 'WORKER' | 'CLIENT')}
            disabled={disabled}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-white">{role.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${role.badge}`}>
                {role.value}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
