import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// commenting out to try ws again
// const neon = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
// const adapter = new PrismaNeon(neon);
// export const prisma = new PrismaClient({ adapter });

// couldn't get ws to work with Neon, maybe in the future
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
} else {
  neonConfig.webSocketConstructor = WebSocket;
}
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
export const prisma = new PrismaClient({ adapter });

// for now, always disconnect the pool
export async function endPrismaPoolOnEdge(runtime: "edge") {
  return;
  // TODO turn the disconnections back on
  // if (runtime === "edge") {
  //   return await prisma.$disconnect();
  // } else {
  //   return await prisma.$disconnect();
  // }
}
