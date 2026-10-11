export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Laravel LP styles live in public/assets/lp — keep parity with production landing. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/assets/lp/style.css?v=14" />
      {children}
    </>
  );
}
