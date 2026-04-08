import { Header } from "@/widgets/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-31">
        {children}
      </main>
    </>
  );
}
