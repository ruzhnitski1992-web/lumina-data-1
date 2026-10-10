import { useRouterState } from "@tanstack/react-router";
import { DetailContent } from "./DetailContent";
export function PageStub({ title, intro }: { section?: { label: string; href: string }; title: string; intro: string }) {
 const path = useRouterState({select: s => s.location.pathname}).replace(/\/$/, "") || "/";
 return <DetailContent title={title} intro={intro} path={path} />;
}
