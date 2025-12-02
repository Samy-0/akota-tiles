"use server";

import { db, tiles, type Tile, type NewTile } from "@/lib/db";
import { eq, or, ilike, desc, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTiles(): Promise<Tile[]> {
  try {
    const result = await db.select().from(tiles).orderBy(desc(tiles.createdAt));
    return result;
  } catch (error) {
    console.error("Error fetching tiles:", error);
    throw new Error("Failed to fetch tiles");
  }
}

export async function getTilesPaginated(
  page = 1,
  limit = 20
): Promise<{ tiles: Tile[]; hasMore: boolean }> {
  try {
    const offset = (page - 1) * limit;
    const result = await db
      .select()
      .from(tiles)
      .orderBy(desc(tiles.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = result.length > limit;
    const tilesData = hasMore ? result.slice(0, limit) : result;

    return { tiles: tilesData, hasMore };
  } catch (error) {
    console.error("Error fetching paginated tiles:", error);
    throw new Error("Failed to fetch tiles");
  }
}

export async function addTile(formData: FormData) {
  try {
    const company = formData.get("company") as string;
    const model = (formData.get("model") as string) || null;
    const grade = (formData.get("grade") as string) || null;
    const size = (formData.get("size") as string) || null;
    const quantity = Number.parseInt(formData.get("quantity") as string) || 0;
    const price = (formData.get("price") as string) || "0";
    const notes = (formData.get("notes") as string) || null;

    if (!company.trim()) {
      return { success: false, message: "Company name is required" };
    }

    // Handle grade - convert "None" to null
    const gradeValue = grade === "None" ? null : grade;

    const newTile: NewTile = {
      company: company.trim(),
      model: model?.trim() || null,
      grade: gradeValue,
      size: size?.trim() || null,
      quantity,
      price,
      notes: notes?.trim() || null,
    };

    await db.insert(tiles).values(newTile);

    revalidatePath("/");
    revalidatePath("/tiles");
    revalidatePath("/analytics");
    return { success: true, message: "Tile added successfully" };
  } catch (error) {
    console.error("Error adding tile:", error);
    return { success: false, message: "Failed to add tile" };
  }
}

export async function updateTile(id: number, formData: FormData) {
  try {
    const company = formData.get("company") as string;
    const model = (formData.get("model") as string) || null;
    const grade = (formData.get("grade") as string) || null;
    const size = (formData.get("size") as string) || null;
    const quantity = Number.parseInt(formData.get("quantity") as string) || 0;
    const price = (formData.get("price") as string) || "0";
    const notes = (formData.get("notes") as string) || null;

    if (!company.trim()) {
      return { success: false, message: "Company name is required" };
    }

    // Handle grade - convert "None" to null
    const gradeValue = grade === "None" ? null : grade;

    const updatedTile = {
      company: company.trim(),
      model: model?.trim() || null,
      grade: gradeValue,
      size: size?.trim() || null,
      quantity,
      price,
      notes: notes?.trim() || null,
      updatedAt: new Date(),
    };

    await db.update(tiles).set(updatedTile).where(eq(tiles.id, id));

    revalidatePath("/");
    revalidatePath("/tiles");
    revalidatePath("/analytics");
    return { success: true, message: "Tile updated successfully" };
  } catch (error) {
    console.error("Error updating tile:", error);
    return { success: false, message: "Failed to update tile" };
  }
}

export async function deleteTile(id: number) {
  try {
    await db.delete(tiles).where(eq(tiles.id, id));

    revalidatePath("/");
    return { success: true, message: "Tile deleted successfully" };
  } catch (error) {
    console.error("Error deleting tile:", error);
    return { success: false, message: "Failed to delete tile" };
  }
}

export async function searchTiles(searchTerm: string): Promise<Tile[]> {
  try {
    if (!searchTerm.trim()) {
      return getTiles();
    }

    const searchPattern = `%${searchTerm.trim()}%`;

    const result = await db
      .select()
      .from(tiles)
      .where(
        or(
          ilike(tiles.company, searchPattern),
          ilike(tiles.model, searchPattern),
          ilike(tiles.size, searchPattern),
          ilike(tiles.notes, searchPattern)
        )
      )
      .orderBy(desc(tiles.createdAt));

    return result;
  } catch (error) {
    console.error("Error searching tiles:", error);
    throw new Error("Failed to search tiles");
  }
}

export async function getTileStats() {
  try {
    const allTiles = await db.select().from(tiles);

    const stats = {
      totalTiles: allTiles.length,
      totalQuantity: allTiles.reduce((sum, tile) => sum + tile.quantity, 0),
      totalValue: allTiles.reduce(
        (sum, tile) => sum + tile.quantity * Number.parseFloat(tile.price),
        0
      ),
      gradeACount: allTiles.filter((tile) => tile.grade === "A").length,
      gradeBCount: allTiles.filter((tile) => tile.grade === "B").length,
      companiesCount: new Set(allTiles.map((tile) => tile.company)).size,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching tile stats:", error);
    throw new Error("Failed to fetch tile statistics");
  }
}

export async function getAllTiles() {
  try {
    const allTiles = await db.select().from(tiles);

    return allTiles;
  } catch (error) {
    console.error("Error fetching tile stats:", error);
    throw new Error("Failed to fetch tile statistics");
  }
}

export interface AnalyticsData {
  totalTiles: number;
  totalQuantity: number;
  totalValue: number;
  totalCompanies: number;
  averagePrice: number;
  gradeDistribution: Array<{ grade: string; count: number }>;
  gradeValueDistribution: Array<{
    grade: string;
    count: number;
    totalValue: number;
  }>;
  topCompaniesByQuantity: Array<{ company: string; quantity: number }>;
  topCompaniesByValue: Array<{ company: string; value: number }>;
  priceRangeDistribution: Array<{ range: string; count: number }>;
  lowStockTiles: Tile[];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const allTiles = await db.select().from(tiles);

    // Basic stats
    const totalTiles = allTiles.length;
    const totalQuantity = allTiles.reduce(
      (sum, tile) => sum + tile.quantity,
      0
    );
    const totalValue = allTiles.reduce(
      (sum, tile) => sum + tile.quantity * Number.parseFloat(tile.price),
      0
    );
    const totalCompanies = new Set(allTiles.map((tile) => tile.company)).size;
    const averagePrice = totalValue / totalQuantity || 0;

    // Grade distribution
    const gradeMap = new Map<string, number>();
    const gradeValueMap = new Map<
      string,
      { count: number; totalValue: number }
    >();

    allTiles.forEach((tile) => {
      const grade = tile.grade || "Ungraded";
      const tileValue = tile.quantity * Number.parseFloat(tile.price);

      gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1);

      const existing = gradeValueMap.get(grade) || { count: 0, totalValue: 0 };
      gradeValueMap.set(grade, {
        count: existing.count + 1,
        totalValue: existing.totalValue + tileValue,
      });
    });

    const gradeDistribution = Array.from(gradeMap.entries()).map(
      ([grade, count]) => ({
        grade,
        count,
      })
    );

    const gradeValueDistribution = Array.from(gradeValueMap.entries()).map(
      ([grade, data]) => ({
        grade,
        count: data.count,
        totalValue: data.totalValue,
      })
    );

    // Company analysis
    const companyQuantityMap = new Map<string, number>();
    const companyValueMap = new Map<string, number>();

    allTiles.forEach((tile) => {
      const quantity = companyQuantityMap.get(tile.company) || 0;
      const value = companyValueMap.get(tile.company) || 0;
      const tileValue = tile.quantity * Number.parseFloat(tile.price);

      companyQuantityMap.set(tile.company, quantity + tile.quantity);
      companyValueMap.set(tile.company, value + tileValue);
    });

    const topCompaniesByQuantity = Array.from(companyQuantityMap.entries())
      .map(([company, quantity]) => ({ company, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const topCompaniesByValue = Array.from(companyValueMap.entries())
      .map(([company, value]) => ({ company, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Price range distribution
    const priceRanges = [
      { min: 0, max: 10, label: "$0-$10" },
      { min: 10, max: 25, label: "$10-$25" },
      { min: 25, max: 50, label: "$25-$50" },
      { min: 50, max: 100, label: "$50-$100" },
      { min: 100, max: Number.POSITIVE_INFINITY, label: "$100+" },
    ];

    const priceRangeDistribution = priceRanges.map((range) => ({
      range: range.label,
      count: allTiles.filter((tile) => {
        const price = Number.parseFloat(tile.price);
        return price >= range.min && price < range.max;
      }).length,
    }));

    // Low stock tiles (less than 50 units)
    const lowStockTiles = await db
      .select()
      .from(tiles)
      .where(lt(tiles.quantity, 50))
      .orderBy(tiles.quantity);

    return {
      totalTiles,
      totalQuantity,
      totalValue,
      totalCompanies,
      averagePrice,
      gradeDistribution,
      gradeValueDistribution,
      topCompaniesByQuantity,
      topCompaniesByValue,
      priceRangeDistribution,
      lowStockTiles,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

export async function verifySecretKey(key: string) {
  try {
    // You can customize this secret key or make it configurable
    const validKeys = [
      "#tiles2025akotatiles",
      process.env.SECRET_KEY || "#tiles2025akotatiles",
    ];

    if (validKeys.includes(key)) {
      return { success: true, message: "Access granted" };
    } else {
      return { success: false, message: "Invalid secret key" };
    }
  } catch (error) {
    console.error("Error verifying secret key:", error);
    return { success: false, message: "Verification failed" };
  }
}
