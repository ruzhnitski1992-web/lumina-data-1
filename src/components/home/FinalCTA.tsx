import { LazySphere } from "./LazySphere";

export function FinalCTA() {
  return (
    <section id="contacto-final" aria-labelledby="cta" className="relative overflow-hidden bg-lp-navy py-24 text-lp-on-dark">
      <div className="absolute -right-40 top-0 h-[600px] w-[600px] opacity-30" aria-hidden><LazySphere light /></div>
      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 lg:grid-cols-2">
        <div>
          <h2 id="cta" className="h2-fluid font-extrabold">Tus datos ya saben dónde estás perdiendo dinero. Deja que nuestros agentes te lo cuenten.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/suscripciones" className="rounded-lg bg-lp-blue px-6 py-3.5 font-semibold hover:shadow-glow">Empieza tus 3 días gratis</a>
            <a href="/suscripciones" className="rounded-lg border border-lp-on-dark/30 px-6 py-3.5 font-semibold hover:border-lp-blue-soft">Ver suscripciones</a>
          </div>
        </div>
        <div className="glass-dark rounded-2xl p-6"><ol className="space-y-4 text-lg"><li><b>1.</b> Elige tu plan: los 3 primeros días son gratis.</li><li><b>2.</b> Tus servicios se activan al instante; si cancelas antes del 4.º día, no pagas nada.</li><li><b>3.</b> Sube tus datos: los agentes analizan y te avisan por correo o WhatsApp de cualquier urgencia.</li></ol></div>
      </div>
    </section>
  );
}
