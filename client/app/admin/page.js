import AdminTable from "@/components/AdminTable";
import Link from "next/link";

export const metadata = {
  title: "Admin Panel - Dr. Nitin Dental Clinic",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        <Link href="/" className="text-sm text-teal-600 hover:underline">
          Back to site
        </Link>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminTable />
      </div>
    </div>
  );
}
