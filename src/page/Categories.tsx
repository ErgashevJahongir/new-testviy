import dayjs from "dayjs";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import useLocalStorage from "@/hooks/useLocalStorage";

export type Category = {
  id: string;
  name: string;
  created_at: Date;
};

function setData(newData: Category[]) {
  localStorage.setItem("testAppCategories", JSON.stringify(newData));
}

const categoryFormSchema = z.object({
  name: z.string().min(1, "Kategoriya nomini kiriting avval"),
});

export default function CategoriesTable() {
  const [data] = useLocalStorage<Category[]>("testAppCategories", []);
  const [editId, setEditId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<Category[]>(data);
  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "id",
      meta: "Id",
      header: "Id",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "name",
      meta: "Nomi",
      header: "Nomi",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "created_at",
      meta: "Yaratilgan vaqti",
      header: "Yaratilgan vaqti",
      cell: ({ row }) => dayjs(row.getValue("created_at")).format("ss:mm:HH DD:MM:YYYY"),
    },
    {
      accessorKey: "action",
      meta: "Amallar",
      header: "Amallar",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                const categoryData = tableData.find(
                  (category) => category.id === row.getValue("id")
                );
                if (categoryData) {
                  setEditId(row.getValue("id"));
                  form.setValue("name", categoryData.name);
                  setOpen(true);
                }
              }}
              size="icon"
              variant="secondary"
            >
              <Pencil className="h-[1.2rem] w-[1.2rem] text-warning" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="secondary">
                  <Trash2 className="h-[1.2rem] w-[1.2rem] text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Haqiqatdan ham o'chirmoqchimisiz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Agar tasdiqlasangiz ma'lumot bazadan o'chiriladi
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const newData = tableData.filter(
                        (category) => category.id !== row.getValue("id")
                      );
                      setData(newData);
                      setTableData(newData);
                      toast("Kategoriya o'chirildi");
                    }}
                  >
                    Tasdiqlash
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    const newData = editId
      ? [
          { id: editId, created_at: new Date(), ...values },
          ...tableData.filter((category) => category.id !== editId),
        ]
      : [
          { id: Math.random().toString(16).slice(2), created_at: new Date(), ...values },
          ...tableData,
        ];
    toast(editId ? "Kategoriya tahrirlandi" : "Kategoriya saqlandi");
    setData(newData);
    setTableData(newData);
    setEditId(null);
    setOpen(false);
    form.reset();
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-2xl font-bold">Kategoriyalar</h3>
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} type="button">
              Kategoriya qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Kategoriya</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategoriya nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Kategoriya nomini kiriting..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        form.reset();
                        setOpen(false);
                        setEditId(null);
                      }}
                      type="button"
                      variant="outline"
                    >
                      Yopish
                    </Button>
                  </DialogClose>
                  <Button type="submit">Saqlash</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Nomi bo'yicha qidirish..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Ma'lumotlarni kamaytirish <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                  >
                    {(column.columnDef.meta as string) || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Ma'lumot topilmadi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} tadan{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize} dan{" "}
          {(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize >
          table.getFilteredRowModel().rows.length
            ? table.getFilteredRowModel().rows.length
            : (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize}{" "}
          gacha.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Oldingi
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Keyingi
          </Button>
        </div>
      </div>
    </div>
  );
}
