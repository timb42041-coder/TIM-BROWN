export const metadata = {
  title: "Tim Brown AI Chat",
  description: "AI assistant built with Next.js + OpenAI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
