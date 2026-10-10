import { Fragment, type ReactNode } from "react";
import { empresa, getField } from "@/config/empresa";

export type Heading = { id: string; text: string; level: number };

export const slugify = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Sustituye {{variables}} y aplica ⟦solo si campo⟧ (línea completa). */
export function preprocess(md: string): string {
  return md
    .split("\n")
    .flatMap((line) => {
      const m = line.match(/⟦solo si ([\w.]+)⟧\s?/);
      if (m) {
        if (!getField(m[1]!)) return [];
        line = line.replace(m[0], "");
      }
      return [line.replace(/\{\{([\w.]+)\}\}/g, (_, k: string) => String(getField(k) ?? ""))];
    })
    .join("\n");
}

/** Negritas y resaltado de [marcadores] en modo borrador. */
export function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\])/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold text-lp-ink">{inline(p.slice(2, -2))}</strong>;
    if (p.startsWith("[") && p.endsWith("]") && empresa.borradorLegal) return <mark key={i} className="rounded bg-[color:var(--lp-draft)] px-0.5 text-lp-ink">{p}</mark>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function renderLegal(md: string): { nodes: ReactNode[]; headings: Heading[]; title: string } {
  const lines = preprocess(md).split("\n");
  const nodes: ReactNode[] = [];
  const headings: Heading[] = [];
  let title = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{1,3}) (.*)$/);
    if (h) {
      const level = h[1]!.length, text = h[2]!;
      if (level === 1) { title = text; i++; continue; }
      const id = slugify(text);
      headings.push({ id, text, level });
      nodes.push(level === 2
        ? <h2 key={i} id={id} className="mt-14 scroll-mt-28 text-2xl font-bold text-lp-ink">{inline(text)}</h2>
        : <h3 key={i} id={id} className="mt-10 scroll-mt-28 text-xl font-bold text-lp-ink">{inline(text)}</h3>);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.startsWith("|")) {
        const cells = lines[i]!.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      nodes.push(
        <div key={i} className="my-6 overflow-x-auto rounded-xl border border-lp-line">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead className="bg-lp-navy text-lp-on-dark"><tr>{head!.map((c, k) => <th key={k} scope="col" className="p-3 font-semibold">{inline(c)}</th>)}</tr></thead>
            <tbody>{body.map((r, k) => <tr key={k} className="border-t border-lp-line align-top">{r.map((c, j) => <td key={j} className="p-3">{inline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i]!.startsWith("- ")) { items.push(lines[i]!.slice(2)); i++; }
      nodes.push(<ul key={i} className="my-4 list-disc space-y-2 pl-6">{items.map((t, k) => <li key={k}>{inline(t)}</li>)}</ul>);
      continue;
    }
    if (line.startsWith("~~") && line.endsWith("~~")) {
      nodes.push(<p key={i} className="mt-2 text-sm italic text-lp-muted">{inline(line.slice(2, -2))}</p>);
      i++; continue;
    }
    nodes.push(<p key={i} className="my-4">{inline(line)}</p>);
    i++;
  }
  return { nodes, headings, title };
}

/** Filas del apartado A de la Política de privacidad, para los formularios. */
export function basicPrivacyRows(privacyMd: string): [string, string][] {
  const md = preprocess(privacyMd);
  const start = md.indexOf("## A.");
  const end = md.indexOf("## B.");
  return md.slice(start, end).split("\n").filter((l) => l.startsWith("|"))
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .filter((c) => !c.every((x) => /^-+$/.test(x))).slice(1) as [string, string][];
}
