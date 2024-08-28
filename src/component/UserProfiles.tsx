import * as React from "react";
import { useEffect, useState } from "react";
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

import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort";

import "../style/userProfile.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
// import { get } from "react-hook-form";
import axios from "axios";

interface ApiResponse<T> {
  data: T;
  status: string;
}

interface User {
  id: number;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => <div>{info.getValue() || "N/A"}</div>,
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone",
    cell: (info) => <div>{info.getValue() || "N/A"}</div>,
  }),
  columnHelper.accessor("password", {
    header: "Password",
    cell: (info) => <PasswordCell password={info.getValue()} />,
  }),
];

const PasswordCell: React.FC<{ password: string }> = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!password || password.trim() === "N/A") {
    return <div> </div>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {showPassword ? password : "******"}
      <IconButton
        onClick={() => setShowPassword((prev) => !prev)}
        style={{ marginLeft: "8px" }}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </div>
  );
};

const UserProfiles = () => {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error] = React.useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [formData, setFormData] = useState<User | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "delete" | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => setDialogOpen(false);

  // Open the appropriate dialog
  const handleOpenDialog = (type: "edit" | "delete", id?: number) => {
    setDialogType(type);
    if (type === "delete") {
      setDeleteId(id ?? null);
    } else {
      fetchDataForEdit(id);
    }
    setDialogOpen(true);
  };

  // Fetch data for editing
  const fetchDataForEdit = async (id?: number) => {
    if (id === undefined) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5114/user/${id}`);
      console.log("response", response);

      const data: ApiResponse<User> = await response.json();
      setFormData(data.data);
    } catch (error) {
      toast.error(`Error fetching data for edit: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (event: React.SyntheticEvent) => {
    event?.preventDefault();
    if (formData) {
      const updatedData: Partial<User> = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      // Ensure required fields are present
      if (!updatedData.email || !updatedData.phone || !updatedData.password) {
        toast.error(`Required fields are missing`);
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:5114/user/${formData.id}`,
          updatedData, // Use data, not body
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data?.data) {
          toast.success("User updated successfully");
        } else {
          toast.error("Network response was not ok");
        }
      } catch (error) {
        toast.error(`Error updating data: ${error}`);
      }
      handleClose();
    }
  };

  // Handle deletion confirmation
  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      try {
        setLoading(true);
        const response = await axios.delete(`http://localhost:5114/user/${deleteId}`);
  
        // Check if the response status is OK (200)
        if (response.status === 200) {
          setData((prevData) => prevData.filter((user) => user.id !== deleteId));
          toast.success("User deleted successfully");
        } else {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
      } catch (error) {
        toast.error(`Error deleting user: ${error}`);
      } finally {
        setLoading(false);
        handleClose();
      }
    }
  };
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5114/user");
        setData(response?.data?.data);
      } catch (error) {
        toast.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
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

  useEffect(() => {
    if (loading) {
      toast.info("Loading...", {
        toastId: "loading-toast",
      });
    } else {
      toast.dismiss("loading-toast");
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  if (loading) return null;
  if (error) return null;

  return (
    <>
      <div></div>
      <div className="table-container">
        <div className="table-top">
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <IconButton
                            onClick={header.column.getToggleSortingHandler()}
                            style={{ marginLeft: "8px" }}
                          >
                            {header.column.getIsSorted() === "desc" ? (
                              <ArrowDownward />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <ArrowUpward />
                            ) : (
                              <SortIcon />
                            )}
                          </IconButton>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td>
                  <IconButton
                    onClick={() => handleOpenDialog("edit", row.original.id)}
                    style={{ color: "blue" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDialog("delete", row.original.id)}
                    style={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={columns.length}>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.max(prev.pageIndex - 1, 0),
                    }))
                  }
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.min(
                        prev.pageIndex + 1,
                        table.getPageCount() - 1
                      ),
                    }))
                  }
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </button>
                <span>
                  Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: +e.target.value,
                    }))
                  }
                >
                  {[5, 10, 25].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
        }}
      >
        {dialogType === "edit" && formData && (
          <>
            <DialogTitle>Edit Information</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Edit the details below and click "Update" to save changes.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                fullWidth
                variant="standard"
                defaultValue={formData.email}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
              />
              <TextField
                margin="dense"
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                fullWidth
                variant="standard"
                defaultValue={formData.phone}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, phone: e.target.value } : null
                  )
                }
              />
              <TextField
                margin="dense"
                id="password"
                name="password"
                label="Password"
                type={passwordVisible ? "text" : "password"}
                fullWidth
                variant="standard"
                defaultValue={formData.password}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, password: e.target.value } : null
                  )
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        edge="end"
                      >
                        {passwordVisible ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </>
        )}
       {dialogType === "delete" && (
          <>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the following user? This action cannot be undone.
              </DialogContentText>              
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="primary">
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default UserProfiles;