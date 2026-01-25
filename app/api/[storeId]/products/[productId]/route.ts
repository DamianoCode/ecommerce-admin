import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Product } from "@prisma/client";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      productId: string;
    };
  }
) {
  try {
    const { productId } = params;

    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: { images: true, category: true, size: true, color: true },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCT_GET]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      productId: string;
      storeId: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = (await req.json()) as Product & { images: [{ url: string }] };

    const {
      categoryId,
      colorId,
      sizeId,
      name,
      price,
      isFeatured,
      isArchived,
      createdAt,
      updatedAt,
      images,
    } = body;
    const { storeId, productId } = params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("Images are required", { status: 400 });
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

    const product = await prismadb.product.findFirst({
      where: { id: productId, storeId: storeId },
      include: {
        images: true,
      },
    });

    if (!product) return new NextResponse("Product not found", { status: 404 });

    await prismadb.product.update({
      where: { id: productId, storeId: storeId },
      data: {
        categoryId,
        colorId,
        sizeId,
        name,
        price,
        isFeatured,
        isArchived,
        createdAt,
        updatedAt,
        images: {
          deleteMany: {},
          createMany: { data: images.map((image) => image) },
        },
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCT_PATCH]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const { storeId, productId } = params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: storeId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.deleteMany({
      where: { id: productId, storeId },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCT_DELETE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
