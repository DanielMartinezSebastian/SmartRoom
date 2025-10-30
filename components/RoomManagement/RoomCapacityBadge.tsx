'use client';

type RoomCapacityBadgeProps = {
  current: number;
  capacity: number;
};

export default function RoomCapacityBadge({ current, capacity }: RoomCapacityBadgeProps) {
  const isFull = current >= capacity;
  const percentage = (current / capacity) * 100;

  const getColorClasses = () => {
    if (percentage >= 100) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    } else if (percentage >= 80) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getColorClasses()}`}
    >
      <span>{current}</span>
      <span>/</span>
      <span>{capacity}</span>
      {isFull && (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </span>
  );
}
