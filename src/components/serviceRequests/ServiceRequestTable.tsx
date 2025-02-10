import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import SeverityBadge from "./SeverityBadge";
import { Schema } from "../../../amplify/data/resource";

const ServiceRequestsTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
}: {
  data: Schema["ServiceRequest"]["type"][];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  sorting: SortingState;
  setSorting: (value: SortingState) => void;
}) => {
  const columnHelper = createColumnHelper<Schema["ServiceRequest"]["type"]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID (UUID)",
        cell: (info) => (
          <div className="font-medium text-[#DCD7C9]">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("serviceName", {
        header: "Service Name",
        cell: (info) => (
          <div className="font-medium text-[#DCD7C9]">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("severity", {
        header: "Severity",
        cell: (info) => <SeverityBadge severity={info.getValue() || "LOW"} />,
      }),
      columnHelper.accessor("location", {
        header: "Location",
        cell: (info) => <div className="text-[#DCD7C9]">{info.getValue()}</div>,
      }),
      columnHelper.accessor("reporterName", {
        header: "Reporter",
        cell: (info) => <div className="text-[#DCD7C9]">{info.getValue()}</div>,
      }),
      columnHelper.accessor("resolutionDate", {
        header: "Resolution Date",
        cell: (info) => (
          <div className="text-[#DCD7C9]">
            {info.getValue()
              ? new Date(info.getValue()).toLocaleDateString()
              : "Pending"}
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4 self-end">
        <input
          placeholder="Search all requests..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border rounded-full px-4 py-2"
        />
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-[#2C3930] text-[#DCD7C9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-[#3F4F44]"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                      default: "",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[#3F4F44] bg-[#3F4F44] hover:bg-[#2C3930] py-4"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-8 py-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRequestsTable;
