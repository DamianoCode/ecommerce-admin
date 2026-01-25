"use client";

import { useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { OrderColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Zamówienia (${data?.length || 0})`}
        description="Zarządzaj zamówieniami na sklepie"
      />
      <Separator />
      <DataTable data={data} columns={columns} searchKey="products" />
      <Separator />
    </>
  );
};
