import "./globals.css";

export const metadata = {
  title: "Dr. Nitin Dental Clinic",
  description: "Quality dental care for the whole family. Book your appointment today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
