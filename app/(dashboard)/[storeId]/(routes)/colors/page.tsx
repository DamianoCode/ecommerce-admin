import { format } from "date-fns";
import { pl } from "date-fns/locale";
import prismadb from "@/lib/prismadb";

import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";

interface ColorProps {
  params: { storeId: string };
}

const Colors: React.FC<ColorProps> = async ({ params }) => {
  const { storeId } = params;
  const colors = await prismadb.color.findMany({
    where: { storeId: storeId },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "do MMMM, yyyy", {
      locale: pl,
    }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default Colors;
