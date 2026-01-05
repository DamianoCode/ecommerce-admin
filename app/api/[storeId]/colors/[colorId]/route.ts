import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      colorId: string;
    };
  }
) {
  try {
    const { colorId } = params;

    const color = await prismadb.color.findFirst({
      where: { id: colorId },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      colorId: string;
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, hexValue } = body;
    const { storeId, colorId } = params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!hexValue)
      return new NextResponse("Hex value is required", { status: 400 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.updateMany({
      where: { id: colorId, storeId: storeId },
      data: { name, hexValue },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_PATCH]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const { storeId, colorId } = params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!colorId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.deleteMany({
      where: { id: colorId, storeId },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
