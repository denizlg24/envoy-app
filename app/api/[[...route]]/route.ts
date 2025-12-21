import { authRoutes } from '@/api/modules/auth/auth.routes';
import { blobRoutes } from '@/api/modules/blobs/blobs.routes';
import { projectRoutes } from '@/api/modules/projects/projects.routes';
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

// Configure runtime for Vercel
export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/auth", authRoutes);
app.route("/projects", projectRoutes);
app.route("/", blobRoutes);

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)
