import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Button } from './button';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found in this view',
  className,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full border border-academic-border rounded-academic bg-white overflow-hidden shadow-subtle', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-academic-border bg-academic-cream/60">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-slate',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-academic-border/60">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-academic-cream/40 transition-colors duration-150"
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn('px-4 py-3.5 text-academic-charcoal align-middle', col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-academic-slate">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-academic-muted stroke-1" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-academic-border bg-academic-cream/30 text-xs text-academic-slate">
          <div>
            Page <span className="font-semibold text-academic-charcoal">{pagination.currentPage}</span> of{' '}
            <span className="font-semibold text-academic-charcoal">{pagination.totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
