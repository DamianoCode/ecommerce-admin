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

    const { name, hexValue } = body;
    const { storeId } = params;

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

    const color = await prismadb.color.create({
      data: { name, hexValue, storeId },
    });

    return NextResponse.json(color);
  } catch (e) {
    console.log("[COLOR_POST]", e);
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

    const colors = await prismadb.color.findMany({
      where: { storeId },
    });

    return NextResponse.json(colors);
  } catch (e) {
    console.log("[COLOR_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
