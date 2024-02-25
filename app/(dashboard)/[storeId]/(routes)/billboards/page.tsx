import { format } from "date-fns";
import { pl } from "date-fns/locale";
import prismadb from "@/lib/prismadb";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

interface BillboardProps {
  params: { storeId: string };
}

const Billboards: React.FC<BillboardProps> = async ({ params }) => {
  const { storeId } = params;
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: storeId },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "do MMMM, yyyy", {
      locale: pl,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;
