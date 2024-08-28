import React from "react";
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
} from "@tanstack/react-table";
import { Box, Button, TextField, Typography, Select, MenuItem } from "@mui/material";
import { Country } from "../types";

// Define the column helper
const columnHelper = createColumnHelper<Country>();

const columns = (
  onEdit: (country: Country) => void,
  onDelete: (id: string) => void
) => [
  columnHelper.accessor("CountryCode", {
    header: "Country Code",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor("CountryName", {
    header: "Country Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor("SortSeq", {
    header: "Sort Sequence",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor("Active", {
    header: "Active",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    enableSorting: false,
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(row.original)}
          style={{ marginRight: "8px" }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onDelete(row.original.id)}
        >
          Delete
        </Button>
      </>
    ),
  }),
];

interface CountryTableProps {
  countries: Country[];
  onEdit: (country: Country) => void;
  onDelete: (id: string) => void;
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  onEdit,
  onDelete,
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: countries,
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      backgroundColor: "#f4f4f4",
                      padding: "8px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => header.column.getToggleSortingHandler()}
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={table.getHeaderGroups()[0].headers.length}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: Math.max(prev.pageIndex - 1, 0),
                      }))
                    }
                    disabled={!table.getCanPreviousPage()}
                    variant="outlined"
                    color="primary"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: Math.min(prev.pageIndex + 1, table.getPageCount() - 1),
                      }))
                    }
                    disabled={!table.getCanNextPage()}
                    variant="outlined"
                    color="primary"
                  >
                    Next
                  </Button>
                  <Typography variant="body2">
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                  </Typography>
                  <Select
                    value={pagination.pageSize}
                    onChange={(e) =>
                      setPagination((prev) => ({
                        ...prev,
                        pageSize: +e.target.value,
                      }))
                    }
                    variant="outlined"
                    size="small"
                  >
                    {[5, 10, 25].map((size) => (
                      <MenuItem key={size} value={size}>
                        Show {size}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Box>
  );
};

export default CountryTable;



// import React from "react";
// import {
//   createColumnHelper,
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   SortingState,
//   PaginationState,
//   flexRender,
// } from "@tanstack/react-table";
// import { Box, Button, TextField } from "@mui/material";
// import { Country } from "../types";

// // Define the column helper
// const columnHelper = createColumnHelper<Country>();

// const columns = (
//   onEdit: (country: Country) => void,
//   onDelete: (id: string) => void
// ) => [
//   columnHelper.accessor("CountryCode", {
//     header: "Country Code",
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor("CountryName", {
//     header: "Country Name",
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor("SortSeq", {
//     header: "Sort Sequence",
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor("Active", {
//     header: "Active",
//     cell: (info) => (info.getValue() ? "Yes" : "No"),
//   }),
//   columnHelper.accessor("id", {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => onEdit(row.original)}
//           style={{ marginRight: "8px" }}
//         >
//           Edit
//         </Button>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={() => onDelete(row.original.id)}
//         >
//           Delete
//         </Button>
//       </>
//     ),
//   }),
// ];

// interface CountryTableProps {
//   countries: Country[];
//   onEdit: (country: Country) => void;
//   onDelete: (id: string) => void;
// }

// const CountryTable: React.FC<CountryTableProps> = ({
//   countries,
//   onEdit,
//   onDelete,
// }) => {
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [pagination, setPagination] = React.useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const table = useReactTable({
//     data: countries,
//     columns: columns(onEdit, onDelete),
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     state: {
//       globalFilter,
//       sorting,
//       pagination,
//     },
//     onGlobalFilterChange: setGlobalFilter,
//     onSortingChange: setSorting,
//     onPaginationChange: setPagination,
//   });

//   return (
//     <Box
//       style={{
//         width: "100%",
//         maxWidth: "1200px",
//         margin: "0 auto",
//         padding: "20px",
//       }}
//     > 
//     <Box style={{ marginBottom: "20px", textAlign: "center" }}>
//         <TextField
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           placeholder="Search..."
//           variant="outlined"
//           size="small"
//         />
//       </Box>
//     <div style={{ overflowX: "auto" }}>      
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div>
//         {/* Pagination Controls */}
//         <button
//           onClick={() => table.setPageIndex((prev) => Math.max(prev - 1, 0))}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </button>
//         <span>
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </span>
//         <button
//           onClick={() =>
//             table.setPageIndex((prev) =>
//               Math.min(prev + 1, table.getPageCount() - 1)
//             )
//           }
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//     </Box>
//   );
// };

// export default CountryTable;
