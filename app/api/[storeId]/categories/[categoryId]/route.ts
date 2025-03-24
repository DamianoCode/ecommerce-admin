import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      categoryId: string;
    };
  }
) {
  try {
    const { categoryId } = params;

    const category = await prismadb.category.findFirst({
      where: { id: categoryId },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      categoryId: string;
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;
    const { storeId, categoryId } = params;

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

    const category = await prismadb.category.updateMany({
      where: { id: categoryId, storeId: storeId },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_PATCH]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const { storeId, categoryId } = params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.deleteMany({
      where: { id: categoryId, storeId },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.log("[CATEGORY_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
