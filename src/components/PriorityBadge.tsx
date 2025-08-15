interface PriorityBadgeProps {
  priority: 'rendah' | 'sedang' | 'tinggi';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'rendah':
        return { color: 'bg-green-100 text-green-800', text: 'Rendah' };
      case 'sedang':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Sedang' };
      case 'tinggi':
        return { color: 'bg-red-100 text-red-800', text: 'Tinggi' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: priority };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
}