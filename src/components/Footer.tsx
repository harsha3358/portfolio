import { personal } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="container-cinematic py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border text-sm text-muted">
      <p>© {new Date().getFullYear()} {personal.name}. All rights reserved.</p>
      <p>Designed &amp; built with intent.</p>
    </footer>
  );
}
