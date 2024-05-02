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
import { Category } from "@/page/Categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type Product = {
  id: string;
  title: string;
  description: string | undefined;
  price: string;
  category: string;
  created_at: Date;
};

let data: Product[] = JSON.parse(localStorage.getItem("testAppProducts") || "[]");

const categoriesData: Category[] = JSON.parse(localStorage.getItem("testAppCategories") || "[]");

function setData(newData: Product[]) {
  localStorage.setItem("testAppProducts", JSON.stringify(newData));
  data = newData;
}

const productFormSchema = z.object({
  title: z.string().min(1, "Mahsulot nomini kiriting avval"),
  description: z.string(),
  price: z
    .string({
      required_error: "Mahsulot narxini kiriting avval",
    })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Narxlarni faqat son bilang yozing",
    }),
  category: z.string().min(1, "Mahsulot kategoriyasini tanlang avval"),
});

export default function ProductsTable() {
  const [editId, setEditId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<Product[]>(data);
  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "title",
      header: "Nomi",
      cell: ({ row }) => row.getValue("title"),
    },
    {
      accessorKey: "category",
      header: "Kategoriyasi",
      cell: ({ row }) =>
        categoriesData.find((category) => category.id === row.getValue("category"))?.name,
    },
    {
      accessorKey: "price",
      header: "Narxi",
      cell: ({ row }) => row.getValue("price"),
    },
    {
      accessorKey: "description",
      header: "Tavsifi",
      cell: ({ row }) => row.getValue("description"),
    },
    {
      accessorKey: "created_at",
      header: "Yaratilgan vaqti",
      cell: ({ row }) => dayjs(row.getValue("created_at")).format("ss:mm:HH DD:MM:YYYY"),
    },
    {
      accessorKey: "action",
      header: "Amallar",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                const productData = tableData.find((product) => product.id === row.getValue("id"));
                if (productData) {
                  setEditId(row.getValue("id"));
                  form.setValue("title", productData.title);
                  form.setValue("price", productData.price);
                  form.setValue("category", productData.category);
                  productData.description && form.setValue("description", productData.description);
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
                        (product) => product.id !== row.getValue("id")
                      );
                      setData(newData);
                      setTableData(newData);
                      toast("Mahsulot o'chirildi");
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

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    const newData = editId
      ? [
          { id: editId, created_at: new Date(), ...values },
          ...tableData.filter((product) => product.id !== editId),
        ]
      : [
          { id: Math.random().toString(16).slice(2), created_at: new Date(), ...values },
          ...tableData,
        ];
    toast(editId ? "Mahsulot tahrirlandi" : "Mahsulot saqlandi");
    setData(newData);
    setTableData(newData);
    setEditId(null);
    setOpen(false);
    form.reset();
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-2xl font-bold">Mahsulotlar</h3>
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} type="button">
              Mahsulot qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Mahsulot</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahsulot nomi</FormLabel>
                      <FormControl>
                        <Input placeholder="Mahsulot nomini kiriting..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahsulot kategoriyasi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Mahsulot kategoriyasini tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesData?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahsulot narxi</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={"any"}
                          placeholder="Mahsulot narxini kiriting..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahsulot tavsifi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mahsulot tavsifini kiriting..."
                          className="resize-none"
                          {...field}
                        />
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
          placeholder="Mahsulot nomi bo'yicha qidirish..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Ma'lumotlarni kamaytirish <ChevronDown className="ml-2 h-4 w-4" />
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
                    {column?.columnDef?.header}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
