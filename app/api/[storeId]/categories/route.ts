import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;
    const { storeId } = params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.create({
      data: { name, storeId, billboardId },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORIES_POST]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { storeId } = params;

    const categories = await prismadb.category.findMany({
      where: { storeId },
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.log("[CATEGORIES_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
