import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-6">
      <hr className="w-full border-t border-gray-900 mb-4" />
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Designed using</span>
          <p className="text-primary font-bold">NextUI</p>
        </Link>
         <p className="text-default-600 mt-2">Developed by students at <span className="text-red-700 font-bold">Illinois Tech</span> 🖥️</p>
      </footer>
    </div>
  );
}
