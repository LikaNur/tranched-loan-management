import { publicProcedure, router } from "./trpc";
import z from "zod";
import { randomWait } from "./utils";
import { TRPCError } from "@trpc/server";

interface Loan {
  id: number;
  initialDebt: number;
  paid: number;
}

const inactiveMap = new Map<number, Loan>();
const activeMap = new Map<number, Loan>();

export function createInitialState() {
  for (var i = 0; i < 20; i++) {
    inactiveMap.set(i, {
      id: i,
      initialDebt: Math.random() * 1000,
      paid: Math.random() * 500,
    });
  }
}

export function resetState() {
  inactiveMap.clear();
  activeMap.clear();
}

export const appRouter = router({
  getInactiveLoanCount: publicProcedure.query(async () => inactiveMap.size),
  getActiveLoanCount: publicProcedure.query(async () => activeMap.size),
  getInactiveLoans: publicProcedure.query(async () =>
    Array.from(inactiveMap.values()),
  ),
  getActiveLoans: publicProcedure.query(async () =>
    Array.from(activeMap.values()),
  ),
  moveLoanToActive: publicProcedure.input(z.number()).mutation(async (opts) => {
    await randomWait();

    const loan = inactiveMap.get(opts.input);
    if (!loan) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Loan not found",
      });
    }

    // Add a 1/3 chance of INTERNAL_SERVER_ERROR
    if (Math.random() < 1 / 3) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      });
    }

    inactiveMap.delete(opts.input);
    activeMap.set(opts.input, loan);

    return loan;
  }),
});

export type AppRouter = typeof appRouter;
