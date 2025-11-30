import { initTRPC } from "@trpc/server";
import { createBunServeHandler } from "trpc-bun-adapter";
import { appRouter, createInitialState } from "./router";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";

const t = initTRPC.create();

export const startServer = () => {
  createInitialState();

  return Bun.serve(
    createBunServeHandler({
      router: appRouter,
      responseMeta(opts) {
        const httpErrorCodes = [...opts.errors]
          .map((e) => getHTTPStatusCodeFromError(e))
          .filter((code) => code !== 415)
          .filter(Boolean);

        return {
          status: httpErrorCodes.length > 0 ? httpErrorCodes[0] : 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          },
        };
      },
    }),
  );
};
