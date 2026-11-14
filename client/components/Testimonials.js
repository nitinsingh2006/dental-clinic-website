const testimonials = [
  {
    name: "Aarav Sharma",
    treatment: "Root Canal Treatment",
    rating: 5,
    text: "I was really anxious before my root canal, but the doctor made the entire process painless and explained every step. Very grateful for the gentle care.",
  },
  {
    name: "Pooja Verma",
    treatment: "Teeth Cleaning & Whitening",
    rating: 5,
    text: "The clinic is spotless and the staff is friendly. The cleaning was thorough, and my teeth whitening results looked natural and bright.",
  },
  {
    name: "Rohan Kulkarni",
    treatment: "Dental Implants",
    rating: 5,
    text: "From consultation to follow-up, everything went smoothly. Booking my slots online was convenient, and the implant feels just like a real tooth.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Patient Reviews
        </h2>
        <p className="text-center text-gray-500 mb-3">
          What our patients say about their experience with us.
        </p>

        {/* Clear disclaimer to avoid presenting demonstration data as real */}
        <div className="max-w-xl mx-auto mb-10 text-center">
          <span className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs px-3 py-1 rounded-full">
            Note: These are sample reviews for demonstration purposes, not real patient endorsements.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
            >
              <div>
                <div
                  className="flex items-center gap-1 text-amber-400 mb-3"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {[...Array(t.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">{t.name}</h3>
                <span className="inline-block mt-1 text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  {t.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
