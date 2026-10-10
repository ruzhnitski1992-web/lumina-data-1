import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useLiveVoice } from "@/hooks/use-live-voice";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff } from "lucide-react";
export function VoicePanel() {
  const [captions, setCaptions] = useState("");
  const [accessError, setAccessError] = useState("");
  const voice = useLiveVoice({
    onEvent: (e) => {
      if (
        (e.type === "session.output_transcript.delta" ||
          e.type === "session.input_transcript.delta") &&
        typeof e["delta"] === "string"
      )
        setCaptions((p) => (p + " " + e["delta"]).slice(-1200));
    },
  });
  const active = voice.status === "connecting" || voice.status === "connected";
  return (
    <div className="border-t border-lp-line py-4">
      <audio ref={voice.audioRef} autoPlay />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={async () => {
            if (active) voice.stop();
            else {
              setAccessError("");
              const { data } = await supabase.auth.getSession();
              if (!data.session) {
                setAccessError("Inicia sesión para usar la voz.");
                return;
              }
              const r = await fetch("/api/public/voice-access", {
                method: "POST",
                headers: { Authorization: `Bearer ${data.session.access_token}` },
              });
              if (!r.ok) {
                setAccessError("No se pudo autorizar la voz.");
                return;
              }
              setCaptions("");
              voice.start();
            }
          }}
          variant={active ? "outline" : "default"}
        >
          {active ? <PhoneOff /> : <Mic />}
          {active ? "Finalizar voz" : "Hablar con Lumina"}
        </Button>
        {active && (
          <Button
            size="icon"
            variant="outline"
            aria-label={voice.muted ? "Activar micrófono" : "Silenciar micrófono"}
            onClick={() => voice.setMuted(!voice.muted)}
          >
            {voice.muted ? <MicOff /> : <Mic />}
          </Button>
        )}
        <span className="text-xs text-lp-muted">
          {voice.status === "connecting"
            ? "Conectando…"
            : voice.status === "connected"
              ? "Conversación activa"
              : "Micrófono necesario para conversar"}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-lp-muted">
        Asistente de IA, no una persona. No incluyas datos sensibles. La voz utiliza créditos de IA.
      </p>
      {accessError && (
        <p role="alert" className="mt-2 text-sm text-lp-alert">
          {accessError}{" "}
          <a href="/auth" className="underline">
            Acceder
          </a>
        </p>
      )}
      {voice.error && (
        <p role="alert" className="mt-2 text-sm text-lp-alert">
          {voice.error}
        </p>
      )}
      {voice.playbackBlocked && (
        <Button variant="link" onClick={voice.resumePlayback}>
          Activar audio
        </Button>
      )}
      {captions && (
        <p aria-live="polite" className="mt-3 text-sm text-lp-slate">
          {captions}
        </p>
      )}
    </div>
  );
}
