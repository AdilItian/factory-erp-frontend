import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
  totalItems?: number;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  isLoading = false,
  skeletonRows = 10,
  totalItems
}: DataTableProps<TData>) {
  const visibleColumns = table.getVisibleLeafColumns();
  const colCount = visibleColumns.length || 1;

  return (
    <div className='flex w-full flex-col gap-4'>
      {children}
      <div className='overflow-hidden rounded-lg border'>
        <ScrollArea className='w-full'>
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ ...getCommonPinningStyles({ column: header.column }) }}
                      className={header.column.getIsPinned() ? 'bg-muted' : ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: colCount }).map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className='bg-muted h-4 animate-pulse rounded' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ ...getCommonPinningStyles({ column: cell.column }) }}
                        className={cell.column.getIsPinned() ? 'bg-background' : ''}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={colCount} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} totalItems={totalItems} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
