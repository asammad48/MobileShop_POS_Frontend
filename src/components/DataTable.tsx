import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showActions?: boolean;
}

export default function DataTable({ columns, data, onEdit, onDelete, showActions = true }: DataTableProps) {
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-primary/20">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold text-foreground">{column.label}</TableHead>
              ))}
              {showActions && <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (showActions ? 1 : 0)} className="text-center text-muted-foreground py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <p className="font-medium">No data available</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.id || index} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {onEdit && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={() => onEdit(row)}
                            data-testid={`button-edit-${row.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(row)}
                            data-testid={`button-delete-${row.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
