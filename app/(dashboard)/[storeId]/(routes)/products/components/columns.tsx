"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  color: string;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nazwa",
  },
  {
    accessorKey: "price",
    header: "Cena",
  },
  {
    accessorKey: "category",
    header: "Kategoria",
  },
  {
    accessorKey: "size",
    header: "Rozmiar",
  },
  {
    accessorKey: "color",
    header: "Kolor",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}{" "}
        <div
          className="h-6 w-6 border rounded-full"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Promocja",
    cell: ({ row }) => renderIcon(row.original.isFeatured),
  },
  {
    accessorKey: "isArchived",
    header: "Archiwum",
    cell: ({ row }) => renderIcon(row.original.isArchived),
  },
  {
    accessorKey: "createdAt",
    header: "Utworzone",
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
