import { format } from "date-fns";
import { pl } from "date-fns/locale";
import prismadb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

interface ProductProps {
  params: { storeId: string };
}

const Products: React.FC<ProductProps> = async ({ params }) => {
  const { storeId } = params;
  const products = await prismadb.product.findMany({
    where: { storeId: storeId },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: priceFormatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, "do MMMM, yyyy", {
      locale: pl,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default Products;
