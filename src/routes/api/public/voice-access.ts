import { createFileRoute } from "@tanstack/react-router";
import { authenticatedClient } from "@/lib/ai/provider.server";
export const Route = createFileRoute("/api/public/voice-access")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await authenticatedClient(request);
          const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
          if (!token) return Response.json({ message: "Inicia sesión." }, { status: 401 });
          return Response.json(
            { ok: true },
            {
              headers: {
                "Set-Cookie": `lumina_voice=${encodeURIComponent(token)}; Path=/api/live; HttpOnly; Max-Age=60${new URL(request.url).protocol === "https:" ? "; SameSite=None; Secure; Partitioned" : "; SameSite=Lax"}`,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch {
          return Response.json({ message: "Inicia sesión para usar la voz." }, { status: 401 });
        }
      },
    },
  },
});
