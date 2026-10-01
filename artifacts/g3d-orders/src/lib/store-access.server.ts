import { createHmac, timingSafeEqual } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const ACCESS_COOKIE = "g3d_store_access";
const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function equalSecret(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return (
    leftBytes.length === rightBytes.length &&
    timingSafeEqual(leftBytes, rightBytes)
  );
}

function signature(expiresAt: number, code: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`g3d-store-access:${code}:${expiresAt}`)
    .digest("base64url");
}

export function hasStoreAccess(): boolean {
  const code = process.env.G3D_STORE_PASSCODE?.trim();
  const secret = process.env.SESSION_SECRET?.trim();
  if (!code || !secret) return false;

  const cookieHeader = getRequest()?.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ACCESS_COOKIE}=`))
    ?.slice(ACCESS_COOKIE.length + 1);
  if (!cookie) return false;

  const separator = cookie.indexOf(".");
  if (separator < 1) return false;
  const expiresAtText = cookie.slice(0, separator);
  const suppliedSignature = cookie.slice(separator + 1);
  if (!/^\d+$/.test(expiresAtText) || !suppliedSignature) return false;

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() / 1000) {
    return false;
  }

  return equalSecret(
    suppliedSignature,
    signature(expiresAt, code, secret),
  );
}

export function assertStoreAccess(): void {
  if (!hasStoreAccess()) {
    throw new Error("Enter the store access code to continue.");
  }
}

export const checkStoreAccess = createServerFn({ method: "GET" }).handler(
  async () => hasStoreAccess(),
);

export const unlockStore = createServerFn({ method: "POST" })
  .validator(z.object({ code: z.string().trim().min(1).max(100) }))
  .handler(async ({ data }) => {
    const configuredCode = process.env.G3D_STORE_PASSCODE?.trim();
    const secret = process.env.SESSION_SECRET?.trim();

    if (!configuredCode || !secret) {
      return { ok: false as const, reason: "not-configured" as const };
    }
    if (!equalSecret(data.code, configuredCode)) {
      return { ok: false as const, reason: "invalid" as const };
    }

    const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_MAX_AGE_SECONDS;
    setCookie(
      ACCESS_COOKIE,
      `${expiresAt}.${signature(expiresAt, configuredCode, secret)}`,
      {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ACCESS_MAX_AGE_SECONDS,
      },
    );

    return { ok: true as const };
  });