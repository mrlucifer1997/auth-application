// src/components/CityTable.tsx

import React from 'react';
import { City } from '../types';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  PaginationState,
  flexRender,
} from '@tanstack/react-table';
import { Box, TextField, Button, Typography } from '@mui/material';

// Define the column helper
const columnHelper = createColumnHelper<City>();

// Define columns with actions and SortSeq
const columns = (onEdit: (city: City) => void, onDelete: (id: string) => void) => [
  columnHelper.accessor('CityName', {
    header: 'City Name',
  }),
  columnHelper.accessor('StateCode', {
    header: 'State Code',
  }),
  columnHelper.accessor('SortSeq', {
    header: 'Sort Seq',
  }),
  columnHelper.accessor('Active', {
    header: 'Active',
    cell: info => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor(row => row, {
    id: 'actions',
    header: 'Actions',
    cell: info => (
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(info.getValue())}
          style={{ marginRight: '8px' }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onDelete(info.getValue().id)}
        >
          Delete
        </Button>
      </Box>
    ),
  }),
];

interface CityTableProps {
  cities: City[];
  onEdit: (city: City) => void;
  onDelete: (id: string) => void;
}

const CityTable: React.FC<CityTableProps> = ({ cities, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Initialize table instance
  const table = useReactTable({
    data: cities,
    columns: columns(onEdit, onDelete),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Box sx={{ marginBottom: "20px", textAlign: "center" }}>
        <TextField
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          variant="outlined"
          size="small"
          sx={{ width: "100%", maxWidth: "300px" }}
        />
      </Box>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      borderBottom: "2px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              width: "100%",
                              color: "#333",
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === "asc" ? (
                                " 🔼"
                              ) : (
                                " 🔽"
                              )
                            ) : (
                              ""
                            )}
                          </button>
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ borderBottom: "1px solid #ddd", padding: "8px" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        {/* Pagination controls */}
        <Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        <Typography sx={{ display: "inline-block", marginLeft: "10px" }}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Typography>
      </Box>
    </Box>
  );
};

export default CityTable;
