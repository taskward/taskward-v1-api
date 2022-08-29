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
  // console.log(
  //   `Query ${params.model}.${params.action} took ${after - before}ms`
  // );
  return result;
});

// Soft delete middleware
// Effect: findUnique findFirst findMany
prisma.$use(async (params: any, next: any) => {
  if (params.action === "findUnique" || params.action === "findFirst") {
    params.action = "findFirst";
  }
  if (params.action === "findMany" || params.action === "findFirst") {
    if (!params.args) {
      params.args = { where: { deletedAt: null } };
    } else if (params.args.where) {
      if (params.args.where.deletedAt == undefined) {
        params.args.where["deletedAt"] = null;
      }
    } else {
      params.args["where"] = { deletedAt: null };
    }
  }
  return next(params);
});

// Effect: update updateMany
prisma.$use(async (params: any, next: any) => {
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
  return next(params);
});

// Effect:
// delete => update
// deleteMany => updateMany
prisma.$use(async (params: any, next: any) => {
  // Check incoming query type
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
  return next(params);
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
