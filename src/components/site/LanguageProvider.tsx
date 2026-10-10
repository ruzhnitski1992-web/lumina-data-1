import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import translations from "@/lib/translations-en.json";
import { translationOverrides } from "@/lib/translation-overrides";

type Language = "es" | "en";
const LanguageContext = createContext<{language: Language; setLanguage: (language: Language) => void}>({language: "es", setLanguage: () => {}});
export const useLanguage = () => useContext(LanguageContext);
const dictionary: Record<string, string> = {...translations, ...translationOverrides};
const foldedDictionary = new Map(Object.entries(dictionary).map(([key,value]) => [key.toLocaleLowerCase(),value]));
function translationFor(key: string) {
  const exact = dictionary[key];
  if (exact) return exact;
  const folded = foldedDictionary.get(key.toLocaleLowerCase());
  return folded && key === key.toLocaleUpperCase() ? folded.toLocaleUpperCase() : folded;
}

// Translate static editorial copy only. User messages, generated reports and form values stay untouched.
export function LanguageProvider({children}: {children: ReactNode}) {
  const [language, setLanguage] = useState<Language>("es");
  useEffect(() => { if (localStorage.getItem("lumina-language") === "en") setLanguage("en"); }, []);
  useEffect(() => {
    localStorage.setItem("lumina-language", language);
    document.documentElement.lang = language;
    const originals = new Map<Text, {es: string; en: string}>();
    const attributes = new Map<Element, Record<string, string>>();
    const translate = () => {
      observer.disconnect();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const text = node as Text;
        if (!text.parentElement?.closest('script,style,textarea,[data-language-original],.is-user,.is-assistant')) {
          const original = originals.get(text);
          if (original && (text.data === original.es || text.data === original.en)) text.data = language === "en" ? original.en : original.es;
          else {
            const key = text.data.trim().replace(/\s+/g, " ");
            const translated = translationFor(key);
            if (translated) {
              const en = text.data.replace(text.data.trim(), translated);
              originals.set(text, {es: text.data, en});
              if (language === "en") text.data = en;
            }
          }
        }
        node = walker.nextNode();
      }
      document.querySelectorAll('[aria-label],[placeholder],[title],[alt]').forEach(element => {
        if (element.closest('[data-language-original]')) return;
        const saved = attributes.get(element) ?? {};
        for (const name of ["aria-label", "placeholder", "title", "alt"]) {
          const value = element.getAttribute(name);
          if (!value) continue;
          const original = saved[name] ?? value;
          const translated = translationFor(original);
          if (translated) { saved[name] = original; element.setAttribute(name, language === "en" ? translated : original); }
        }
        attributes.set(element, saved);
      });
      observer.observe(document.body, {childList: true, subtree: true, characterData: true});
    };
    const observer = new MutationObserver(translate);
    translate();
    return () => { observer.disconnect(); originals.forEach((value, node) => {if (node.data === value.en) node.data = value.es;}); attributes.forEach((saved, element) => Object.entries(saved).forEach(([name,value]) => element.setAttribute(name,value))); };
  }, [language]);
  return <LanguageContext.Provider value={{language,setLanguage}}>{children}</LanguageContext.Provider>;
}
export function LanguageSwitch() {
  const {language,setLanguage} = useLanguage();
  return <div className="flex shrink-0 items-center gap-0.5" aria-label="Idioma / Language" data-language-original>{(["es","en"] as const).map(value => <Button key={value} variant={value === language ? "secondary" : "ghost"} size="sm" className="h-8 px-2 text-xs" aria-pressed={language === value} onClick={() => setLanguage(value)}>{value.toUpperCase()}</Button>)}</div>;
}