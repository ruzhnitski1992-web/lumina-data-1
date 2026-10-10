// Única fuente de los datos de la empresa. Úsala en todo el sitio.
export const empresa = {
  razonSocial: "LUMINA DATA INSIGHTS",
  nombreComercial: "Lumina Data Insights",
  nif: "B6847213",
  direccion: "Av. del Carrilet, 3, Planta 2 Edificio D, Sants-Montjuïc",
  codigoPostal: "08902",
  ciudad: "Barcelona",
  provincia: "Barcelona",
  email: "atteencliente.022@gmail.com",
  emailPrivacidad: "atteencliente.022@gmail.com",
  telefono: "",
  dominio: "https://luminadatainsights.com",
  registroMercantil: { tomo: "", folio: "", hoja: "", inscripcion: "" },
  codigosConducta: "",
  registroMarca: "", // p. ej.: "registradas ante la OEPM con el número [NÚMERO]"
  dpd: { nombre: "", email: "" },
  proveedores: { hosting: "Lovable y Cloudflare (alojamiento y base de datos en la UE/EE. UU.)", correo: "Google (Gmail)", crm: "sin CRM externo; base de datos propia", newsletter: "no se envían boletines", analitica: "Google Analytics, solo con consentimiento", modeloIA: "OpenAI, Anthropic y Google (vía API empresarial)" },
  fechaActualizacionLegal: "10 de octubre de 2026",
  versionPoliticas: "1.0",
  borradorLegal: false,
  reservaMineriaDatos: false,
  usaAnalitica: true,
  usaMapa: true,
  // ID de medición de Google Analytics (G-XXXXXXX). Vacío = no se carga nunca.
  gaMeasurementId: "",
};

export type Empresa = typeof empresa;

export function getField(path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), empresa);
}
