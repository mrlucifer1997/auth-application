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
import { Button, Box, Typography, TextField } from "@mui/material";
import { State } from "../types";

// Define column helper
const columnHelper = createColumnHelper<State>();

// Define columns for the table
const columns = [
  columnHelper.accessor("StateCode", {
    header: "State Code",
    enableSorting: true,
  }),
  columnHelper.accessor("StateName", {
    header: "State Name",
    enableSorting: true,
  }),
  columnHelper.accessor("CountryCode", {
    header: "Country Code",
    enableSorting: true,
  }),
  columnHelper.accessor("SortSeq", {
    header: "Sort Sequence",
    enableSorting: true,
  }),
  columnHelper.accessor("Active", {
    header: "Active",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    enableSorting: false,
  }),
];

interface StateTableProps {
  states: State[];
  onEdit: (state: State) => void;
  onDelete: (id: string) => void;
}

const StateTable: React.FC<StateTableProps> = ({ states, onEdit, onDelete }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: states,
    columns,
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
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ borderBottom: "1px solid #ddd", padding: "8px" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  <Box>
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
                  </Box>
                </td>
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

export default StateTable;





// src/components/StateTable.tsx

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
// import { Button, Box, Typography, TextField } from "@mui/material";
// import { State } from "../types";

// // Define columns for the table
// const columnHelper = createColumnHelper<State>();

// const columns = [
//   columnHelper.accessor("StateCode", {
//     header: "State Code",
//   }),
//   columnHelper.accessor("StateName", {
//     header: "State Name",
//   }),
//   columnHelper.accessor("CountryId", {
//     header: "Country ID",
//   }),
//   columnHelper.accessor("Active", {
//     header: "Active",
//     cell: (info) => (info.getValue() ? "Yes" : "No"),
//   }),
// ];

// interface StateTableProps {
//   states: State[];
//   onEdit: (state: State) => void;
//   onDelete: (id: string) => void;
// }

// const StateTable: React.FC<StateTableProps> = ({
//   states,
//   onEdit,
//   onDelete,
// }) => {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [pagination, setPagination] = React.useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const table = useReactTable({
//     data: states,
//     columns,
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
//       <Box style={{ marginBottom: "20px", textAlign: "center" }}>
//         <TextField
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           placeholder="Search..."
//           variant="outlined"
//           size="small"
//         />
//       </Box>
//       <div style={{ overflowX: "auto" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     style={{
//                       borderBottom: "2px solid #ddd",
//                       padding: "8px",
//                       textAlign: "left",
//                     }}
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </th>
//                 ))}
//                 <th
//                   style={{
//                     borderBottom: "2px solid #ddd",
//                     padding: "8px",
//                     textAlign: "left",
//                   }}
//                 >
//                   Actions
//                 </th>
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <td
//                     key={cell.id}
//                     style={{ borderBottom: "1px solid #ddd", padding: "8px" }}
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//                 <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
//                   <Box>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => onEdit(row.original)}
//                       style={{ marginRight: "8px" }}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="secondary"
//                       onClick={() => onDelete(row.original.id)}
//                     >
//                       Delete
//                     </Button>
//                   </Box>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Box style={{ marginTop: "20px", textAlign: "center" }}>
//         {/* Pagination controls */}
//         <Button
//           onClick={() => table.setPageIndex(0)}
//           disabled={!table.getCanPreviousPage()}
//         >
//           {"<<"}
//         </Button>
//         <Button
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           {"<"}
//         </Button>
//         <Button
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           {">"}
//         </Button>
//         <Button
//           onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//           disabled={!table.getCanNextPage()}
//         >
//           {">>"}
//         </Button>
//         <Typography style={{ display: "inline-block", marginLeft: "10px" }}>
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default StateTable;





// // src/components/StateTable.tsx

// import React from 'react';
// import { State } from '../types';
// import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// interface StateTableProps {
//   states: State[];
//   onEdit: (state: State) => void;
//   onDelete: (id: string) => void;
// }

// const StateTable: React.FC<StateTableProps> = ({ states, onEdit, onDelete }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>State Code</TableCell>
//             <TableCell>State Name</TableCell>
//             <TableCell>Country ID</TableCell>
//             <TableCell>Active</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {states.map(state => (
//             <TableRow key={state.id}>
//               <TableCell>{state.StateCode}</TableCell>
//               <TableCell>{state.StateName}</TableCell>
//               <TableCell>{state.CountryId}</TableCell>
//               <TableCell>{state.Active ? 'Yes' : 'No'}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => onEdit(state)}
//                   style={{ marginRight: '8px' }}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={() => onDelete(state.id)}
//                 >
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default StateTable;
