import { format } from "date-fns";
import { pl } from "date-fns/locale";
import prismadb from "@/lib/prismadb";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

interface CategoryProps {
  params: { storeId: string };
}

const Categorys: React.FC<CategoryProps> = async ({ params }) => {
  const { storeId } = params;
  const categories = await prismadb.category.findMany({
    where: { storeId: storeId },
    include: {
      billboard: true,
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard?.label,
    createdAt: format(item.createdAt, "do MMMM, yyyy", {
      locale: pl,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Categorys;
