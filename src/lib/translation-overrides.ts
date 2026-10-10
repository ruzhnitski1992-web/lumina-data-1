// Short labels and split React text nodes require exact keys rather than sentence translations.
export const translationOverrides: Record<string,string> = {
  "/mes": "/month", "/trimestre": "/quarter", "/año": "/year",
  "50 €/mes equivalente · IVA incluido": "€50/month equivalent · VAT included",
  "20,83 €/mes equivalente · IVA incluido": "€20.83/month equivalent · VAT included",
  "Lo esencial para empezar · IVA incluido": "The essentials to get started · VAT included",
  "Agentes IA": "AI agents", "Aceptar": "Accept", "Rechazar": "Reject", "Configurar": "Configure",
  "RGPD": "GDPR", "IVA incluido": "VAT included", "EE. UU.": "United States",
  "Banca": "Banking", "Seguros": "Insurance", "Industria": "Industry", "Salud": "Healthcare",
  "Servicios Profesionales": "Professional services", "24 agentes": "24 agents",
};