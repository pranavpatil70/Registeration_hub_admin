import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Registration } from '@/lib/supabase';
import TypeBadge from './TypeBadge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { SortField, SortDirection } from '@/hooks/useRegistrations';

interface RegistrationsTableProps {
  registrations: Registration[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onDelete: (id: number) => Promise<{ success: boolean; error?: string }>;
}

const RegistrationsTable = ({ 
  registrations, 
  sortField, 
  sortDirection, 
  onSort, 
  onDelete 
}: RegistrationsTableProps) => {
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number; name: string }>({
    open: false,
    id: 0,
    name: '',
  });
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    return <ArrowDown className="h-4 w-4" />;
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await onDelete(deleteDialog.id);
    setDeleting(false);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Registration deleted successfully.",
      });
      setDeleteDialog({ open: false, id: 0, name: '' });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete registration.",
        variant: "destructive",
      });
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-2 hover:text-foreground transition-colors"
    >
      {children}
      {getSortIcon(field)}
    </button>
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="data-table-header">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <SortableHeader field="name">Name</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <SortableHeader field="registration_type">Type</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <SortableHeader field="created_at">Registration Date</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-mono text-lg">No registrations found</p>
                      <p className="text-sm">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              ) : (
                registrations.map((registration, index) => (
                  <tr 
                    key={registration.id} 
                    className="data-table-row transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-foreground">{registration.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground">{registration.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TypeBadge type={registration.registration_type} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {registration.company || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground">
                        {registration.phone || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground">
                        {format(new Date(registration.created_at), 'MMM dd, yyyy')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteDialog({ open: true, id: registration.id, name: registration.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        name={deleteDialog.name}
        loading={deleting}
      />
    </>
  );
};

export default RegistrationsTable;
