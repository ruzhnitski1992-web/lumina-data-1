import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Header } from "@/components/site/Header";
afterEach(cleanup);
describe("Header dropdowns", () => {
  it.each(["Agentes IA", "Secciones", "Analítica", "Recursos", "Empresa", "Últimas noticias"])("opens and closes %s", (label) => {
    render(<Header />);
    const control = screen.getByRole("button", {name: label});
    fireEvent.click(control);
    expect(control).toHaveAttribute("aria-expanded", "true");
    const id = control.getAttribute("aria-controls");
    const panel = id ? document.getElementById(id) : null;
    expect(panel).not.toHaveAttribute("inert");
    expect(panel?.querySelectorAll("a").length).toBeGreaterThan(0);
    fireEvent.keyDown(window, {key: "Escape"});
    expect(control).toHaveAttribute("aria-expanded", "false");
  });
  it("includes integrated AI providers", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", {name: "Agentes IA"}));
    expect(screen.getByRole("link", {name: /ChatGPT · OpenAI/})).toHaveAttribute("href", "/ias/chatgpt");
    expect(screen.getByRole("link", {name: /Claude · Anthropic/})).toHaveAttribute("href", "/ias/claude");
    expect(screen.getByRole("link", {name: /Gemini · Google/})).toHaveAttribute("href", "/ias/gemini");
  });
});