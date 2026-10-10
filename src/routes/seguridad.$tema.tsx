import { createFileRoute, notFound } from "@tanstack/react-router";
import { securityTopics } from "@/lib/content";
import { pageHead } from "@/lib/meta";
export const Route = createFileRoute("/seguridad/$tema")({
  loader: ({ params }) => {
    const t = securityTopics.find((t) => t.slug === params.tema);
    if (!t) throw notFound();
    return t;
  },
  head: ({ params, loaderData }) =>
    pageHead(
      loaderData?.title ?? "Controles de seguridad",
      "Responsabilidades, controles y referencias oficiales para el uso de IA empresarial.",
      `/seguridad/${params.tema}`,
    ),
  component: Page,
});
function Page() {
  const t = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-3xl px-5 pt-36 pb-24">
      <a href="/seguridad" className="text-lp-blue">
        ← Centro de Seguridad
      </a>
      <h1 className="h2-fluid mt-6 font-extrabold">{t.title}</h1>
      <div className="prose-lumina">
        <h2>Alcance y obligaciones</h2>
        <p>{t.text}</p>
        <h2>Proceso de revisión</h2>
        <p>
          Antes del tratamiento se define la finalidad, se inventarían las fuentes y se identifican
          responsables y accesos. Durante el análisis se documentan evidencias, limitaciones e
          incidencias. Antes de usar el resultado se revisan las conclusiones y se acuerdan
          conservación y eliminación. Las obligaciones específicas dependen de los datos, el uso y
          el contrato.
        </p>
        <h2>Información oficial</h2>
        <p>
          <a href={t.source} target="_blank" rel="noreferrer" className="text-lp-blue underline">
            Consultar la fuente oficial
          </a>
        </p>
        <h2>Consultas y derechos</h2>
        <p>
          Contacta con{" "}
          <a href="mailto:atteencliente.022@gmail.com" className="text-lp-blue">
            atteencliente.022@gmail.com
          </a>
          . No adjuntes datos sensibles al primer contacto.
        </p>
      </div>
    </main>
  );
}
