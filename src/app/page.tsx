import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akota Tiles & Fittings Gallery - Tiles Inventory",
};

import TilesTable from "@/components/tiles-table";
import { StatsGrid } from "@/components/stats-grid";
import { getTileStats } from "@/lib/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTileButton } from "@/components/add-tile-button";
import { formatNumbers } from "@/lib/utils";

export default function Page() {
  return (
    <div className="overflow-hidden px-4 md:px-6 lg:px-8">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-2 px-3">
          <p className="sr-only">Akota Tiles</p>
          <svg
            height={24}
            viewBox="0 0 370 73"
            className="w-auto h-auto text-foreground"
          >
            <g
              id="SvgjsG1102"
              transform="matrix(0.9002057613168724,0,0,0.9002057613168724,-8.578959806465807,-12.62988744939796)"
              fill="currentColor"
            >
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M14.03,50.03l13.5,13.5l13.5-13.5l-13.5-13.5L14.03,50.03 M27.53,32.03l18,18l-18,18l-18-18L27.53,32.03"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M27.53,54.53l4.5-4.5l-4.5-4.5l-4.5,4.5L27.53,54.53 M18.53,50.03l9-9l9,9l-9,9L18.53,50.03"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M68.03,72.53l-18-18l-18,18l18,18L68.03,72.53 M72.53,72.53l-22.5,22.5l-22.5-22.5l22.5-22.5L72.53,72.53"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M59.03,72.53l-9-9l-9,9l9,9L59.03,72.53 M63.53,72.53l-13.5,13.5l-13.5-13.5l13.5-13.5L63.53,72.53"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <polyline
                xmlns="http://www.w3.org/2000/svg"
                points="54.53,72.53 50.03,77.03 45.53,72.53 50.03,68.03 54.53,72.53 "
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M41.03,27.53l9,9l9-9l-9-9L41.03,27.53 M36.53,27.53l13.5-13.5l13.5,13.5l-13.5,13.5L36.53,27.53"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <polyline
                xmlns="http://www.w3.org/2000/svg"
                points="45.53,27.53 50.03,23.03 54.53,27.53 50.03,32.03 45.53,27.53 "
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M72.53,45.53l-4.5,4.5l4.5,4.5l4.5-4.5L72.53,45.53 M81.53,50.03l-9,9l-9-9l9-9L81.53,50.03"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
              />
            </g>
            <g
              transform="matrix(1.087231865337023,0,0,1.087231865337023,82.80805705658612,7.517818486448418)"
              fill="currentColor"
            >
              <path d="M2.52 40 c-0.16 0 -0.32 -0.08 -0.4 -0.24 c-0.12 -0.12 -0.12 -0.32 -0.08 -0.48 l9.32 -23.96 c0.08 -0.2 0.28 -0.32 0.48 -0.32 l5.36 0 c0.2 0 0.4 0.12 0.48 0.32 l9.16 23.96 c0.04 0.16 0.04 0.32 -0.08 0.48 c-0.08 0.16 -0.24 0.24 -0.4 0.24 l-5.56 0 c-0.2 0 -0.4 -0.12 -0.48 -0.32 l-1.48 -3.68 l-9 0.04 l-1.48 3.64 c-0.08 0.2 -0.28 0.32 -0.48 0.32 l-5.36 0 z M11.48 31 l5.76 0 l-2.88 -8.48 z M33.948 40 c-0.28 0 -0.52 -0.24 -0.52 -0.52 l0 -23.96 c0 -0.28 0.24 -0.52 0.52 -0.52 l5.2 0 c0.28 0 0.52 0.24 0.52 0.52 l0 7.08 l7.24 -7.44 c0.12 -0.08 0.24 -0.16 0.4 -0.16 l6.04 0 c0.2 0 0.4 0.12 0.48 0.28 c0.08 0.2 0.04 0.4 -0.08 0.56 l-8.08 8.64 l9 14.68 c0.08 0.08 0.12 0.2 0.12 0.32 c0 0.28 -0.24 0.52 -0.52 0.52 l-6.24 0 c-0.16 0 -0.32 -0.08 -0.4 -0.24 l-6.6 -11.16 l-1.36 1.2 l0 9.68 c0 0.28 -0.24 0.52 -0.52 0.52 l-5.2 0 z  M71.416 40 c-2.4 0 -4.6 -0.56 -6.52 -1.68 c-1.96 -1.12 -3.52 -2.72 -4.68 -4.64 c-1.12 -1.96 -1.68 -4.2 -1.68 -6.6 c0 -2.36 0.56 -4.56 1.68 -6.52 c1.16 -1.96 2.68 -3.52 4.64 -4.64 s4.16 -1.68 6.56 -1.68 c2.36 0 4.56 0.56 6.52 1.68 s3.52 2.68 4.64 4.64 c1.16 1.96 1.72 4.16 1.72 6.52 c0 2.4 -0.56 4.6 -1.72 6.56 c-1.12 1.96 -2.68 3.52 -4.64 4.68 c-1.96 1.12 -4.16 1.68 -6.52 1.68 z M71.49600000000001 34.24 c1.16 0 2.24 -0.32 3.2 -0.92 c1 -0.64 1.8 -1.48 2.36 -2.6 c0.6 -1.08 0.88 -2.32 0.88 -3.64 c0 -1.28 -0.28 -2.52 -0.88 -3.6 c-0.56 -1.08 -1.36 -1.92 -2.36 -2.56 c-0.96 -0.6 -2.04 -0.92 -3.2 -0.92 c-1.2 0 -2.28 0.32 -3.28 0.92 c-1.04 0.64 -1.84 1.48 -2.44 2.56 c-0.6 1.12 -0.88 2.32 -0.88 3.6 c0 1.32 0.28 2.56 0.88 3.64 c0.64 1.08 1.44 1.96 2.44 2.56 c1 0.64 2.08 0.96 3.28 0.96 z M96.12400000000001 40 c-0.28 0 -0.48 -0.24 -0.48 -0.52 l0 -18.88 l-5.48 0 c-0.28 0 -0.52 -0.2 -0.52 -0.48 l0 -4.6 c0 -0.28 0.24 -0.52 0.52 -0.52 l17.16 0 c0.32 0 0.52 0.24 0.52 0.52 l0 4.6 c0 0.28 -0.2 0.48 -0.52 0.48 l-5.48 0 l0 18.88 c0 0.28 -0.24 0.52 -0.52 0.52 l-5.2 0 z M112.91199999999999 40 c-0.16 0 -0.32 -0.08 -0.4 -0.24 c-0.12 -0.12 -0.12 -0.32 -0.08 -0.48 l9.32 -23.96 c0.08 -0.2 0.28 -0.32 0.48 -0.32 l5.36 0 c0.2 0 0.4 0.12 0.48 0.32 l9.16 23.96 c0.04 0.16 0.04 0.32 -0.08 0.48 c-0.08 0.16 -0.24 0.24 -0.4 0.24 l-5.56 0 c-0.2 0 -0.4 -0.12 -0.48 -0.32 l-1.48 -3.68 l-9 0.04 l-1.48 3.64 c-0.08 0.2 -0.28 0.32 -0.48 0.32 l-5.36 0 z M121.872 31 l5.76 0 l-2.88 -8.48 z M164.04799999999997 40 c-0.28 0 -0.48 -0.24 -0.48 -0.52 l0 -18.88 l-5.48 0 c-0.28 0 -0.52 -0.2 -0.52 -0.48 l0 -4.6 c0 -0.28 0.24 -0.52 0.52 -0.52 l17.16 0 c0.32 0 0.52 0.24 0.52 0.52 l0 4.6 c0 0.28 -0.2 0.48 -0.52 0.48 l-5.48 0 l0 18.88 c0 0.28 -0.24 0.52 -0.52 0.52 l-5.2 0 z M183.236 40 c-0.28 0 -0.52 -0.24 -0.52 -0.52 l0 -23.96 c0 -0.28 0.24 -0.52 0.52 -0.52 l5.2 0 c0.28 0 0.52 0.24 0.52 0.52 l0 23.96 c0 0.28 -0.24 0.52 -0.52 0.52 l-5.2 0 z M196.42399999999998 40 c-0.28 0 -0.52 -0.24 -0.52 -0.52 l0 -23.96 c0 -0.28 0.24 -0.52 0.52 -0.52 l5.2 0 c0.28 0 0.52 0.24 0.52 0.52 l0 18.72 l9 0 c0.28 0 0.52 0.24 0.52 0.52 l0 4.72 c0 0.28 -0.24 0.52 -0.52 0.52 l-14.72 0 z M218.61199999999997 40 l0 -23.96 c0 -1 0.2 -1.2 0.52 -1.2 l17.52 0 c0.28 0 0.52 0.2 0.52 0.48 l0 4.52 c0 0.28 -0.24 0.52 -0.52 0.52 l-11.84 0 l0 4.16 l7.48 0 c0.28 0 0.52 0.24 0.52 0.52 l0 4.48 c0 0.28 -0.24 0.52 -0.52 0.52 l-7.48 0 l0 4.28 l11.8 0 c0.28 0 0.52 0.24 0.52 0.52 l0 4.48 c0 0.28 -0.24 0.52 -0.52 0.52 l-17.48 0 c-0.32 0 -0.52 -0.24 -0.52 0.16 z M254.79999999999998 40.24 c-1.92 0 -3.84 -0.36 -5.68 -1.08 c-1.84 -0.68 -3.48 -1.68 -4.84 -2.88 c-0.16 -0.16 -0.2 -0.4 -0.12 -0.6 l1.4 -4.76 c0.08 -0.16 0.2 -0.28 0.36 -0.28 c0.16 -0.04 0.32 0 0.44 0.12 c2.12 2 4.52 3.8 7.52 3.96 c0.8 0.04 1.68 0.08 2.44 -0.16 c2.36 -0.76 1.36 -3.16 -0.4 -3.88 c-0.6 -0.24 -1.44 -0.52 -2.52 -0.84 c-1.6 -0.44 -2.92 -0.92 -3.92 -1.4 c-1.08 -0.48 -2 -1.24 -2.8 -2.24 c-0.76 -1.04 -1.16 -2.4 -1.16 -4.04 c0 -1.56 0.4 -2.92 1.2 -4.08 s1.92 -2.08 3.32 -2.68 s3.04 -0.92 4.88 -0.92 c1.64 0 3.24 0.24 4.84 0.76 c1.56 0.48 2.96 1.16 4.2 1.96 c0.2 0.16 0.28 0.4 0.16 0.64 l-1.32 4.48 c-0.04 0.16 -0.16 0.24 -0.32 0.28 c-0.12 0.04 -0.28 0.04 -0.4 -0.04 c-1.8 -1.12 -3.6 -2.48 -5.72 -2.76 c-1.4 -0.2 -3.52 -0.12 -4 1.56 c-0.6 2.16 2.56 2.72 4 3.16 c1.6 0.48 2.92 0.96 3.96 1.44 c1.08 0.52 2.04 1.32 2.8 2.32 c0.8 1.04 1.2 2.44 1.2 4.12 c0 1.64 -0.44 3.04 -1.28 4.24 c-0.8 1.2 -1.96 2.08 -3.4 2.72 c-1.44 0.56 -3.04 0.88 -4.84 0.88 z" />
            </g>
          </svg>
        </div>
        <div className="flex gap-3 ml-auto"></div>
      </header>
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
        {/* Page intro */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Tiles Inventory</h1>
            <p className="text-sm text-muted-foreground">
              Here&rsquo;s an overview of your tiles. Manage or add new ones
              with ease!
            </p>
          </div>
          <AddTileButton />
        </div>
        <Suspense
          fallback={
            <Skeleton className="grid grid-cols-2 min-[1200px]:grid-cols-4 rounded-xl border border-transparent">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="relative p-4 lg:p-5">
                  <div className="min-h-20"></div>
                </div>
              ))}
            </Skeleton>
          }
        >
          <GridContent />
        </Suspense>
        {/* Table */}
        <div className="min-h-[100vh] flex-1 md:min-h-min">
          <TilesTable />
        </div>
      </div>
    </div>
  );
}

const GridContent = async () => {
  const stats = await getTileStats();

  return (
    <StatsGrid
      stats={[
        {
          title: "Tiles",
          value: formatNumbers(stats.totalTiles, false),
          change: {
            value: "+0%",
            trend: "up",
          },
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z" />
              <path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845" />
            </svg>
          ),
        },
        {
          title: "Quantity",
          value: formatNumbers(stats.totalQuantity, false),
          change: {
            value: "+0%",
            trend: "up",
          },
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={19}
              fill="currentColor"
            >
              <path d="M2 9.5c0 .313.461.858 1.53 1.393C4.914 11.585 6.877 12 9 12c2.123 0 4.086-.415 5.47-1.107C15.538 10.358 16 9.813 16 9.5V7.329C14.35 8.349 11.827 9 9 9s-5.35-.652-7-1.671V9.5Zm14 2.829C14.35 13.349 11.827 14 9 14s-5.35-.652-7-1.671V14.5c0 .313.461.858 1.53 1.393C4.914 16.585 6.877 17 9 17c2.123 0 4.086-.415 5.47-1.107 1.069-.535 1.53-1.08 1.53-1.393v-2.171ZM0 14.5v-10C0 2.015 4.03 0 9 0s9 2.015 9 4.5v10c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5ZM9 7c2.123 0 4.086-.415 5.47-1.107C15.538 5.358 16 4.813 16 4.5c0-.313-.461-.858-1.53-1.393C13.085 2.415 11.123 2 9 2c-2.123 0-4.086.415-5.47 1.107C2.461 3.642 2 4.187 2 4.5c0 .313.461.858 1.53 1.393C4.914 6.585 6.877 7 9 7Z" />
            </svg>
          ),
        },
        {
          title: "Value",
          value: formatNumbers(stats.totalValue),
          change: {
            value: "+0%",
            trend: "up",
          },
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          ),
        },
        {
          title: "Companies",
          value: stats.companiesCount,
          change: {
            value: "+0%",
            trend: "up",
          },
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
              <path d="M10 6h4" />
              <path d="M10 10h4" />
              <path d="M10 14h4" />
              <path d="M10 18h4" />
            </svg>
          ),
        },
      ]}
    />
  );
};
