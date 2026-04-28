const API_ROUTE_PATTERNS = [
  { pattern: /^\/api\/auth\/github\/device\/?$/, path: "/api/auth/github/device" },
  { pattern: /^\/api\/auth\/github\/token\/?$/, path: "/api/auth/github/token" },
  { pattern: /^\/api\/health\/?$/, path: "/api/health" },
  { pattern: /^\/api\/projects\/?$/, path: "/api/projects" },
  { pattern: /^\/api\/projects\/[^/]+\/members\/?$/, path: "/api/projects/:projectId/members" },
  { pattern: /^\/api\/projects\/[^/]+\/members\/[^/]+\/?$/, path: "/api/projects/:projectId/members/:userId" },
  { pattern: /^\/api\/projects\/[^/]+\/head\/?$/, path: "/api/projects/:projectId/head" },
  { pattern: /^\/api\/projects\/[^/]+\/blobs\/[^/]+\/upload\/?$/, path: "/api/projects/:projectId/blobs/:hash/upload" },
  { pattern: /^\/api\/projects\/[^/]+\/blobs\/[^/]+\/download\/?$/, path: "/api/projects/:projectId/blobs/:hash/download" },
  { pattern: /^\/api\/status\/cron\/?$/, path: "/api/status/cron" },
  { pattern: /^\/api\/status\/stats\/?$/, path: "/api/status/stats" },
] as const;

const SENSITIVE_SEGMENT_PATTERNS = [
  /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/,
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  /^[0-9a-f]{12,}$/i,
  /^\d+$/,
  /^[A-Za-z0-9_-]{16,}$/,
];

export function sanitizeApiPath(pathOrUrl: string) {
  const path = normalizePath(pathOrUrl);

  for (const route of API_ROUTE_PATTERNS) {
    if (route.pattern.test(path)) {
      return route.path;
    }
  }

  return path
    .split("/")
    .map((segment) => (isSensitiveSegment(segment) ? ":param" : segment))
    .join("/");
}

function normalizePath(pathOrUrl: string) {
  let path = pathOrUrl;

  try {
    path = new URL(pathOrUrl).pathname;
  } catch {
    path = pathOrUrl.split(/[?#]/, 1)[0] || "/";
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function isSensitiveSegment(segment: string) {
  if (!segment) {
    return false;
  }

  let decodedSegment = segment;
  try {
    decodedSegment = decodeURIComponent(segment);
  } catch {
    decodedSegment = segment;
  }

  return SENSITIVE_SEGMENT_PATTERNS.some((pattern) => pattern.test(decodedSegment));
}
