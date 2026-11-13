const services = [
  {
    title: "General Checkup",
    description: "Routine examination to keep your teeth and gums healthy. Recommended every six months.",
  },
  {
    title: "Teeth Cleaning",
    description: "Professional scaling and polishing to remove plaque and tartar buildup.",
  },
  {
    title: "Teeth Whitening",
    description: "Safe, effective whitening treatment to brighten your smile by several shades.",
  },
  {
    title: "Root Canal",
    description: "Pain-free procedure to treat infected tooth pulp and save your natural tooth.",
  },
  {
    title: "Braces",
    description: "Metal and ceramic braces to gradually correct misaligned teeth and bite issues.",
  },
  {
    title: "Dental Implants",
    description: "Permanent, natural-looking replacement for missing teeth that function like real ones.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Services</h2>
        <p className="text-center text-gray-500 mb-10">Everything you need for a healthy, confident smile.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-teal-700 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
