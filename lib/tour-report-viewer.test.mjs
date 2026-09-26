import { test } from "node:test";
import assert from "node:assert/strict";
import { createViewerToken, readViewerToken, VIEWER_MAX_AGE } from "./tour-report-viewer.ts";

test("verified identity expires and cannot be changed by the browser", () => {
  const secret = "test-only-secret";
  const now = 100000;
  const token = createViewerToken("viewer@example.com", secret, now);
  assert.equal(readViewerToken(token, secret, now), "viewer@example.com");
  assert.equal(readViewerToken(token, secret, now + VIEWER_MAX_AGE * 1000), null);
  assert.equal(readViewerToken(token, "other-secret", now), null);
  const forged = Buffer.from(JSON.stringify({ email: "forged@example.com", expires: now + 10000 })).toString("base64url");
  assert.equal(readViewerToken(`${forged}.${token.split(".")[1]}`, secret, now), null);
  for (const bad of [undefined, "", "bad", `${token}.extra`, "x".repeat(1025)]) assert.equal(readViewerToken(bad, secret, now), null);
});
