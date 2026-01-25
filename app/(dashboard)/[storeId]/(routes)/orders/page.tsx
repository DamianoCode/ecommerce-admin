import prismadb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

interface OrderProps {
  params: { storeId: string };
}

const Orders: React.FC<OrderProps> = async ({ params }) => {
  const { storeId } = params;
  const orders = await prismadb.order.findMany({
    where: { storeId: storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    email: item.email,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: priceFormatter.format(item.totalPrice.toNumber()),
    createdAt: format(item.createdAt, "do MMMM, yyyy", {
      locale: pl,
    }),
    updatedAt: format(item.updatedAt, "do MMMM, yyyy", {
      locale: pl,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default Orders;
