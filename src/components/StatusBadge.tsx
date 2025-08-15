interface StatusBadgeProps {
  status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'menunggu':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' };
      case 'diproses':
        return { color: 'bg-blue-100 text-blue-800', text: 'Diproses' };
      case 'selesai':
        return { color: 'bg-green-100 text-green-800', text: 'Selesai' };
      case 'ditolak':
        return { color: 'bg-red-100 text-red-800', text: 'Ditolak' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
}