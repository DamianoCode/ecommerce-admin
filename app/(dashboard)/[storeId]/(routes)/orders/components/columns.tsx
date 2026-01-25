"use client";

import { Order } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { CellAction } from "./cell-action";

export type OrderColumn = Omit<
  Order,
  "storeId" | "totalPrice" | "createdAt" | "updatedAt"
> & {
  products: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Numer ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    accessorKey: "address",
    header: "Adres",
  },
  {
    accessorKey: "totalPrice",
    header: "Cena",
  },
  {
    accessorKey: "isPaid",
    header: "Zapłacone",
    cell: ({ row }) => renderIcon(row.original.isPaid),
  },
  {
    accessorKey: "createdAt",
    header: "Utworzone",
  },
  {
    accessorKey: "products",
    header: "Produkty",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const renderIcon = (value: boolean) => {
  if (value) {
    return <Check className="h-4 w-4 text-green-600" />;
  }
  return <X className="h-4 w-4 text-red-600" />;
};
