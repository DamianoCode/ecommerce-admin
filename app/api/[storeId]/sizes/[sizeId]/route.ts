import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      sizeId: string;
    };
  }
) {
  try {
    const { sizeId } = params;

    const size = await prismadb.size.findFirst({
      where: { id: sizeId },
    });

    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      sizeId: string;
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;
    const { storeId, sizeId } = params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.updateMany({
      where: { id: sizeId, storeId: storeId },
      data: { name, value },
    });

    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_PATCH]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const { storeId, sizeId } = params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!sizeId)
      return new NextResponse("Size ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.deleteMany({
      where: { id: sizeId, storeId },
    });

    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
