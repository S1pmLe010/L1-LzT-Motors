import "./globals.css";

export const metadata = {
  title: "L1 LzT Motors",
  description: "Premium automotive marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}