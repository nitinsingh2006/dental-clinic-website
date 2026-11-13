export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-teal-50 to-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Dr. Nitin Dental Clinic
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Caring for your smile with gentle, professional dental treatment for the whole family.
        </p>
        <a
          href="#book"
          className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-teal-700 transition-colors"
        >
          Book an Appointment
        </a>
      </div>
    </section>
  );
}
