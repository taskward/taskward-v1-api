import { PrismaClient } from "@prisma/client";

interface CustomNodeJSGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJSGlobal;

const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
  });

// Logging middleware
prisma.$use(async (params: any, next: any) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`
  );
  return result;
});

// Soft delete middleware
prisma.$use(async (params: any, next: any) => {
  if (params.model == "Post") {
    if (params.action === "findUnique" || params.action === "findFirst") {
      // Change to findFirst - you cannot filter by anything except ID / unique with findUnique
      params.action = "findFirst";
      // Add 'deletedAt' filter
      // ID filter maintained
      params.args.where["deletedAt"] = null;
    }
    if (params.action === "findMany") {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deletedAt == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where["deletedAt"] = null;
        }
      } else {
        params.args["where"] = { deletedAt: null };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params: any, next: any) => {
  if (params.model == "Post") {
    if (params.action == "update") {
      // Change to updateMany - you cannot filter by anything except ID / unique with findUnique
      params.action = "updateMany";
      // Add 'deletedAt' filter ID filter maintained
      params.args.where["deletedAt"] = null;
    }
    if (params.action == "updateMany") {
      if (params.args.where != undefined) {
        params.args.where["deletedAt"] = null;
      } else {
        params.args["where"] = { deletedAt: null };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params: any, next: any) => {
  // Check incoming query type
  if (params.model == "Post") {
    if (params.action == "delete") {
      // Delete queries Change action to an update
      params.action = "update";
      params.args["data"] = { deleteAt: new Date().toISOString() };
    }
    if (params.action == "deleteMany") {
      // Delete many queries
      params.action = "updateMany";
      if (params.args.data != undefined) {
        params.args.data["deletedAt"] = new Date().toISOString();
      } else {
        params.args["data"] = { deletedAt: new Date().toISOString() };
      }
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
