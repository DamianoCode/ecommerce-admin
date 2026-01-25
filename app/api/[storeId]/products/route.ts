import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Product } from "@prisma/client";

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
    const body = (await req.json()) as Product & { images: [{ url: string }] };

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isArchived = false,
      isFeatured = false,
    } = body;
    const { storeId } = params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!images || !images.length)
      return new NextResponse("Images are required", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category is required", { status: 400 });
    if (!colorId) return new NextResponse("Color is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size is required", { status: 400 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        storeId,
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: images.map((image) => image),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCTS_POST]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  { url }: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  try {
    const { searchParams } = new URL(url);
    const { storeId } = params;

    const isArchived = searchParams.get("isArchived");
    const isFeatured = searchParams.get("isFeatured");
    const name = searchParams.get("name");
    const price = searchParams.get("price");

    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isArchived: isArchived ? isArchived === "true" : undefined,
        isFeatured: isFeatured ? isFeatured === "true" : undefined,
        name: name ? name : undefined,
        price: price ? price : undefined,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (e) {
    console.log("[PRODUCTS_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
