import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId: string;
  method: string;
  path: string;
  statusCode?: number;
  durationMs?: number;
  message?: string;
  error?: string;
  ip?: string;
}

const REQUEST_ID_HEADER = "x-request-id";

export function getRequestId(req: IncomingMessage): string {
  const headerValue = req.headers[REQUEST_ID_HEADER];

  if (typeof headerValue === "string" && headerValue.trim()) {
    return headerValue.trim();
  }

  return randomUUID();
}

export function logEntry(entry: LogEntry): void {
  // Structured JSON log ke stdout untuk konsumsi journalctl / log aggregator.
  console.log(JSON.stringify(entry));
}

export function logRequestStart(
  req: IncomingMessage,
  requestId: string,
): void {
  logEntry({
    timestamp: new Date().toISOString(),
    level: "info",
    requestId,
    method: req.method ?? "UNKNOWN",
    path: req.url ?? "/",
    ip: req.socket.remoteAddress ?? "unknown",
  });
}

export function logRequestComplete(
  req: IncomingMessage,
  res: ServerResponse,
  requestId: string,
  startTime: number,
): void {
  const durationMs = Date.now() - startTime;

  logEntry({
    timestamp: new Date().toISOString(),
    level: "info",
    requestId,
    method: req.method ?? "UNKNOWN",
    path: req.url ?? "/",
    statusCode: res.statusCode,
    durationMs,
  });
}

export function logError(
  req: IncomingMessage,
  requestId: string,
  error: unknown,
): void {
  const message = error instanceof Error ? error.message : String(error);

  logEntry({
    timestamp: new Date().toISOString(),
    level: "error",
    requestId,
    method: req.method ?? "UNKNOWN",
    path: req.url ?? "/",
    message,
    error: message,
  });
}
