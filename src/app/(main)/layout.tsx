import { Header } from "@/widgets/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="md:pt-34 pt-20 pb-4 md:pb-0 md:px-10 px-4 overflow-x-clip">
        {children}
      </main>
    </>
  );
}
