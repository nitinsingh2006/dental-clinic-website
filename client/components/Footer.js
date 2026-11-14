import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Dr. Nitin Dental Clinic</h3>
          <p className="text-sm leading-relaxed">
            Providing quality dental care in a comfortable, welcoming environment since 2010.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="text-sm space-y-1">
            <li>Vijay Nagar, Indore</li>
            <li>Madhya Pradesh 452010</li>
            <li className="mt-2">Phone: +91 80851 49264</li>
            <li>Email: <a href="mailto:nsingh987610@gmail.com" className="hover:text-teal-400">nsingh987610@gmail.com</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#services" className="hover:text-teal-400">Services</a></li>
            <li><a href="#book" className="hover:text-teal-400">Book Appointment</a></li>
            <li><a href="#testimonials" className="hover:text-teal-400">Testimonials</a></li>
            <li><Link href="/admin" className="hover:text-teal-400">Admin Panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-sm text-center text-gray-500">
        2024 Dr. Nitin Dental Clinic. All rights reserved.
      </div>
    </footer>
  );
}
