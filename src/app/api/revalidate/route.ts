import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint
 * Использовать когда нужно очистить ISR кэш
 * 
 * POST /api/revalidate?secret=YOUR_REVALIDATE_SECRET&path=/produit/lot-mini-vehicules
 */
export async function POST(request: NextRequest) {
  // Verify secret
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Invalid revalidation secret" },
      { status: 401 }
    );
  }

  // Get path to revalidate
  const path = request.nextUrl.searchParams.get("path") || "/";

  try {
    // Revalidate specific path or all product pages
    if (path === "*") {
      // Revalidate all product pages
      revalidatePath("/produit", "page");
      revalidatePath("/boutique", "page");
      revalidatePath("/categorie", "page");
      revalidatePath("/", "page");
      return NextResponse.json(
        { message: "Revalidated all pages" },
        { status: 200 }
      );
    } else {
      revalidatePath(path, "page");
      return NextResponse.json(
        { message: `Revalidated path: ${path}` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[REVALIDATE] Error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
