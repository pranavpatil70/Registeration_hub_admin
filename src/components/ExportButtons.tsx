import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Registration } from '@/lib/supabase';
import { format } from 'date-fns';

interface ExportButtonsProps {
  allRegistrations: Registration[];
  filteredRegistrations: Registration[];
}

const ExportButtons = ({ allRegistrations, filteredRegistrations }: ExportButtonsProps) => {
  const exportToCSV = (data: Registration[], filename: string) => {
    const headers = ['ID', 'Name', 'Email', 'Type', 'Company', 'Phone', 'Registration Date'];
    const rows = data.map(r => [
      r.id,
      r.name,
      r.email,
      r.registration_type,
      r.company || '',
      r.phone || '',
      format(new Date(r.created_at), 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToCSV(allRegistrations, 'all_registrations')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export All to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV(filteredRegistrations, 'filtered_registrations')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Filtered to CSV ({filteredRegistrations.length} rows)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButtons;
