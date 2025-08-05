"use client";

import { cn, formatNumbers } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiErrorWarningLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiFilter3Line,
  RiSearch2Line,
  RiCheckLine,
  RiMoreLine,
} from "@remixicon/react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Tile } from "@/lib/schema";
import { deleteTile, getAllTiles, updateTile } from "@/lib/actions";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { InputWithSuggestions } from "./ui/input-with-suggestions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const statusFilterFn: FilterFn<Tile> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

interface GetColumnsProps {
  data: Tile[];
  setData: React.Dispatch<React.SetStateAction<Tile[]>>;
}

// const Companies = [
//   {
//     id: "FR",
//     name: "Fresh Ceramics",
//   },
//   {
//     id: "KH",
//     name: "Khadeim Ceramics",
//   },
//   {
//     id: "RAK",
//     name: "RAK Ceramics",
//   },
//   {
//     id: "AB",
//     name: "ABC Ceramics",
//   },
//   {
//     id: "AKIJ",
//     name: "AKIJ Ceramics",
//   },
//   {
//     id: "ATI",
//     name: "ATI Ceramics",
//   },
//   {
//     id: "AURA",
//     name: "AURA Ceramics",
//   },
//   {
//     id: "BHL",
//     name: "BHL Ceramics",
//   },
//   {
//     id: "CHARU",
//     name: "CHARU Ceramics",
//   },
//   {
//     id: "DSC",
//     name: "DSC Ceramics",
//   },
//   {
//     id: "FONDY",
//     name: "FONDY Ceramics",
//   },
//   {
//     id: "MO",
//     name: "Monalisa Ceramics",
//   },
//   {
//     id: "X",
//     name: "X Monika Ceramics",
//   },
// ];

const getColumns = ({ data, setData }: GetColumnsProps): ColumnDef<Tile>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Company",
    accessorKey: "company",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("company")}</span>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    header: "Model",
    accessorKey: "model",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("model")}</span>
    ),
    size: 110,
  },

  {
    header: "Grade",
    accessorKey: "grade",
    cell: ({ row }) => (
      <div>
        <span className="sr-only">{row.original.grade}</span>
        {row.original.grade === "A" ? (
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-600"
          >
            <path
              d="M11.6605 1.75323C12.8285 1.37514 14.0989 1.9012 14.6575 2.99445L15.3284 4.3089C15.4083 4.46494 15.5356 4.59147 15.6917 4.6712L17.0062 5.34308C18.0992 5.90168 18.6254 7.17134 18.2474 8.33917L17.7923 9.74347C17.7383 9.91026 17.7383 10.0904 17.7923 10.2571L18.2474 11.6605C18.6255 12.8284 18.0994 14.0989 17.0062 14.6575L15.6917 15.3284C15.5355 15.4083 15.4083 15.5355 15.3284 15.6917L14.6575 17.0062C14.0989 18.0994 12.8284 18.6254 11.6605 18.2474L10.2571 17.7923C10.0903 17.7383 9.91027 17.7383 9.74347 17.7923L8.33917 18.2474C7.17136 18.6253 5.90168 18.0992 5.34308 17.0062L4.6712 15.6917C4.59146 15.5356 4.46495 15.4083 4.3089 15.3284L2.99445 14.6575C1.9012 14.0989 1.37514 12.8285 1.75323 11.6605L2.20734 10.2571C2.26134 10.0903 2.26134 9.9103 2.20734 9.74347L1.75323 8.33917C1.37514 7.17121 1.9012 5.90162 2.99445 5.34308L4.3089 4.6712C4.46474 4.59148 4.59147 4.46474 4.6712 4.3089L5.34308 2.99445C5.90162 1.9012 7.17121 1.37514 8.33917 1.75323L9.74347 2.20734C9.9103 2.26134 10.0903 2.26134 10.2571 2.20734L11.6605 1.75323ZM9.07159 6.00031L6.00031 14.5198H7.88409L8.50812 12.7083H11.7845L12.4075 14.5198H14.304L11.2318 6.00031H9.07159ZM11.2796 11.2083H9.02374L10.1517 7.92023L11.2796 11.2083Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground/50"
          >
            <path
              d="M11.6605 1.75323C12.8285 1.37514 14.0989 1.9012 14.6575 2.99445L15.3284 4.3089C15.4083 4.46494 15.5356 4.59147 15.6917 4.6712L17.0062 5.34308C18.0992 5.90168 18.6254 7.17134 18.2474 8.33917L17.7923 9.74347C17.7383 9.91026 17.7383 10.0904 17.7923 10.2571L18.2474 11.6605C18.6255 12.8284 18.0994 14.0989 17.0062 14.6575L15.6917 15.3284C15.5355 15.4083 15.4083 15.5355 15.3284 15.6917L14.6575 17.0062C14.0989 18.0994 12.8284 18.6254 11.6605 18.2474L10.2571 17.7923C10.0903 17.7383 9.91027 17.7383 9.74347 17.7923L8.33917 18.2474C7.17136 18.6253 5.90168 18.0992 5.34308 17.0062L4.6712 15.6917C4.59146 15.5356 4.46495 15.4083 4.3089 15.3284L2.99445 14.6575C1.9012 14.0989 1.37514 12.8285 1.75323 11.6605L2.20734 10.2571C2.26134 10.0903 2.26134 9.9103 2.20734 9.74347L1.75323 8.33917C1.37514 7.17121 1.9012 5.90162 2.99445 5.34308L4.3089 4.6712C4.46474 4.59148 4.59147 4.46474 4.6712 4.3089L5.34308 2.99445C5.90162 1.9012 7.17121 1.37514 8.33917 1.75323L9.74347 2.20734C9.9103 2.26134 10.0903 2.26134 10.2571 2.20734L11.6605 1.75323ZM6.888 5.4798V14.0003H10.6077C11.6396 14.0003 12.4317 13.808 12.9837 13.4241C13.5437 13.0321 13.8235 12.4398 13.8235 11.6478C13.8235 11.0481 13.6321 10.5682 13.2484 10.2083C12.8911 9.85865 12.3816 9.65481 11.721 9.59406C12.0673 9.55507 12.3644 9.47038 12.6116 9.33234C12.8916 9.18034 13.1044 8.97603 13.2484 8.72003C13.3923 8.45611 13.4641 8.14806 13.4642 7.7962C13.4642 6.99636 13.1841 6.41226 12.6243 6.04425C12.0643 5.66825 11.2555 5.4798 10.1995 5.4798H6.888ZM10.5237 10.3284C10.9637 10.3284 11.3164 10.4235 11.5804 10.6155C11.8523 10.7995 11.9876 11.072 11.9876 11.4319C11.9876 11.7919 11.8523 12.0644 11.5804 12.2484C11.3164 12.4244 10.9637 12.512 10.5237 12.512H8.71222V10.3284H10.5237ZM10.1517 6.96808C10.6156 6.96808 10.9758 7.0521 11.2318 7.22003C11.4956 7.37997 11.6281 7.63582 11.6282 7.98761C11.6282 8.31561 11.492 8.56845 11.22 8.74445C10.956 8.92037 10.5996 9.00812 10.1517 9.00812H8.71222V6.96808H10.1517Z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    ),
    size: 90,
  },
  {
    header: "Size",
    accessorKey: "size",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("size") || "-"}
      </span>
    ),
    size: 110,
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatNumbers(row.getValue("quantity"), false)}
      </span>
    ),
    size: 110,
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatNumbers(parseInt(row.getValue("price")) || 0, false)}
        <span className="text-lg leading-0">৳</span>
      </span>
    ),
    size: 110,
  },
  {
    header: "Total Price",
    accessorKey: "totalPrice",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatNumbers(row.getValue("totalPrice"), false)}
      </span>
    ),
    size: 110,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="flex items-center h-full">
        <Badge
          variant="outline"
          className={cn(
            "gap-1 py-0.5 px-2 text-sm",
            row.original.quantity === 0
              ? "text-muted-foreground"
              : "text-primary-foreground"
          )}
        >
          {row.original.quantity > 0 && (
            <RiCheckLine
              className="text-emerald-500"
              size={14}
              aria-hidden="true"
            />
          )}
          {row.original.quantity === 0 && "- "}
          {row.original.quantity > 0 ? "Available" : "Unavailable"}
        </Badge>
      </div>
    ),
    size: 110,
    filterFn: statusFilterFn,
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("notes") || "-"}
      </span>
    ),
    size: 180,
  },
  {
    id: "searchQuery",
    accessorKey: "searchQuery",
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <RowActions setData={setData} data={data} item={row.original} />
    ),
    size: 60,
    enableHiding: false,
  },
];

export default function TilesTable() {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "quantity",
      desc: true,
    },
  ]);

  const [data, setData] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(() => getColumns({ data, setData }), [data]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllTiles();
        setData(
          data.map((item) => ({
            ...item,
            totalPrice: (parseInt(item.price) || 0) * (item.quantity || 0),
            searchQuery:
              `${item.company} ${item.model} ${item.size}`.toLowerCase(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id)
    );
    setData(updatedData);
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility: {
        ...columnVisibility,
        searchQuery: false,
      },
    },
  });

  // Extract complex expressions into separate variables
  const companyColumn = table.getColumn("company");
  const companyFacetedValues = companyColumn?.getFacetedUniqueValues();
  const companyFilterValue = companyColumn?.getFilterValue();

  // Update useMemo hooks with simplified dependencies
  const companyNames = useMemo(() => {
    if (!companyColumn) return [];
    const values = Array.from(companyFacetedValues?.keys() ?? []);
    return values.sort();
  }, [companyColumn, companyFacetedValues]);

  const companyCounts = useMemo(() => {
    if (!companyColumn) return new Map();
    return companyFacetedValues ?? new Map();
  }, [companyColumn, companyFacetedValues]);

  const selectedCompanies = useMemo(() => {
    return (companyFilterValue as string[]) ?? [];
  }, [companyFilterValue]);

  const handleCompanyChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("company")
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("company")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Filter by name */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                Boolean(table.getColumn("searchQuery")?.getFilterValue()) &&
                  "pe-9"
              )}
              value={
                (table.getColumn("searchQuery")?.getFilterValue() ??
                  "") as string
              }
              onChange={(e) =>
                table.getColumn("searchQuery")?.setFilterValue(e.target.value)
              }
              placeholder="Search by model"
              type="text"
              aria-label="Search by model, company, or size"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              <RiSearch2Line size={20} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("searchQuery")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("searchQuery")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <RiCloseCircleLine size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <RiDeleteBinLine
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                  >
                    <RiErrorWarningLine className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <RiFilter3Line
                  className="size-5 -ms-1.5 text-muted-foreground/60"
                  size={20}
                  aria-hidden="true"
                />
                Filter
                {selectedCompanies.length > 0 && (
                  <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {selectedCompanies.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="end">
              <div className="space-y-3">
                <div className="text-xs font-medium uppercase text-muted-foreground/60">
                  Company
                </div>
                <div className="space-y-3">
                  {companyNames.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedCompanies.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleCompanyChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {companyCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b w-full">
        <TableHeader className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer select-none items-center gap-2"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <RiArrowUpSLine
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <RiArrowDownSLine
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
      </Table>

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p
            className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            Page{" "}
            <span className="text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="text-foreground">{table.getPageCount()}</span>
          </p>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function RowActions({
  setData,
  data,
  item,
}: {
  setData: React.Dispatch<React.SetStateAction<Tile[]>>;
  data: Tile[];
  item: Tile;
}) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    company: "",
    model: "",
    grade: "None",
    size: "",
    quantity: 0,
    price: 0,
    notes: "",
  });

  const isMobile = useIsMobile();

  const handleDelete = async () => {
    startUpdateTransition(() => {
      const updatedData = data.filter((dataItem) => dataItem.id !== item.id);
      setData(updatedData);
      setShowDeleteDialog(false);
    });
    await deleteTile(item.id);
  };

  const handleEdit = (formData: FormData) => {
    startTransition(() => {
      const newData = {
        company: formData.get("company") as string,
        model: formData.get("model") as string,
        grade: formData.get("grade") as string,
        size: formData.get("size") as string,
        quantity: Number(formData.get("quantity")) as number,
        price: formData.get("price") as string | number,
        notes: formData.get("notes") as string,
      };

      const updatedData = data.map((dataItem) => {
        if (dataItem.id === item.id) {
          return { ...dataItem, ...newData };
        }
        // Ensure the returned object matches the Tile type, especially for 'price' (should be string)
        return dataItem;
      });
      setData(
        updatedData.map((tile) => ({
          ...tile,
          price:
            typeof tile.price === "number" ? tile.price.toString() : tile.price,
        }))
      );
      updateTile(item.id, formData);
      setShowEditDialog(false);
    });
  };

  const EditForm = () => (
    <form action={handleEdit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="company">Company Name *</Label>
        <InputWithSuggestions
          id="company"
          name="company"
          defaultValue={formData.company}
          placeholder="Enter company name"
          suggestions={[
            "AB",
            "AKIJ",
            "ATI",
            "AURA",
            "BHL",
            "CBC",
            "CHARU",
            "CHINA",
            "DSC",
            "FONDE",
            "FONDY",
            "FR",
            "GORDA",
            "KCL",
            "KH",
            "LOCAL",
            "MARBEL",
            "MO",
            "RAK",
            "SL",
            "X",
          ]}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="model">Model Number</Label>
        <Input
          id="model"
          name="model"
          defaultValue={formData.model}
          placeholder="Enter model number"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="grade">Grade</Label>
          <Select name="grade" defaultValue={formData.grade}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            name="size"
            defaultValue={formData.size}
            placeholder="e.g., 12x12, 24x24"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={formData.quantity}
            placeholder="0"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={formData.price}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={formData.notes}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Update Tile
      </Button>
    </form>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none text-muted-foreground/60"
              aria-label="Edit item"
            >
              <RiMoreLine className="size-5" size={20} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setFormData({
                  company: item.company,
                  model: item.model || "",
                  grade: item.grade || "None",
                  size: item.size || "",
                  quantity: item.quantity,
                  price: parseFloat(item.price),
                  notes: item.notes || "",
                });
                setShowEditDialog(true);
              }}
            >
              Edit Tile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isMobile ? (
        <>
          <Drawer open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DrawerContent className="max-h-[90vh]">
              <DrawerHeader>
                <DrawerTitle>Edit Tile</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4 overflow-y-auto">
                <EditForm />
              </div>
            </DrawerContent>
          </Drawer>
          <Drawer open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DrawerContent className="max-h-[90vh]">
              <DrawerHeader>
                <DrawerTitle>Delete Tile</DrawerTitle>
                <DrawerDescription>
                  Are you sure you want to delete this tile?
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isUpdatePending}
                  className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                >
                  Delete
                </Button>
                <DrawerClose asChild>
                  <Button disabled={isUpdatePending} variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Tile</DialogTitle>
              </DialogHeader>
              <EditForm />
            </DialogContent>
          </Dialog>
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this contact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isUpdatePending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isUpdatePending}
                  className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
