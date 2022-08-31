import { Prisma, PrismaClient } from "@prisma/client";
import { softDeleteModels } from "./softDeleteModel";

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
prisma.$use(
  async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    // console.log(
    //   `Query ${params.model}.${params.action} took ${after - before}ms`
    // );
    return result;
  }
);

// Soft delete middleware
// Effect:
// findUnique => findFirst ( default filter with deletedAt null )
// findMany ( default filter with deletedAt null )
prisma.$use(
  async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) => {
    if (params.model && softDeleteModels.includes(params.model)) {
      if (params.action === "findUnique") {
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
    }
    return next(params);
  }
);

// Effect:
// update => updateMany
prisma.$use(
  async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) => {
    if (params.model && softDeleteModels.includes(params.model)) {
      if (params.action == "update") {
        params.action = "updateMany";
      }
      if (params.action == "updateMany") {
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
    }
    return next(params);
  }
);

// Effect:
// delete => for delete
// deleteMany => updateMany / for soft delete
prisma.$use(
  async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) => {
    if (params.model && softDeleteModels.includes(params.model)) {
      // if (params.action == "delete") {
      //   params.action = "update";
      //   if (params.args.data != undefined) {
      //     params.args.data["deletedAt"] = new Date().toISOString();
      //   } else {
      //     params.args["data"] = { deletedAt: new Date().toISOString() };
      //   }
      // }
      if (params.action == "deleteMany") {
        params.action = "updateMany";
        if (params.args.data != undefined) {
          params.args.data["deletedAt"] = new Date().toISOString();
        } else {
          params.args["data"] = { deletedAt: new Date().toISOString() };
        }
      }
    }
    return next(params);
  }
);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
