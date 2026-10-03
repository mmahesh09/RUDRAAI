import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
}

// Reports errors thrown in Server Components, route handlers and middleware
export const onRequestError = Sentry.captureRequestError;
