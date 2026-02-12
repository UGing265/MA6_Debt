import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const TrustLogos = () => {
  const companies = [
    "Acme Corp", "Globex", "Soylent", "Initech", "Umbrella", "Massive Dynamic"
  ];

  return (
    <section className="bg-[#FDFBF9] py-12 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-lg font-semibold leading-8 text-[#4A3728]">
          Trusted by Companies
        </h2>
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
          {companies.map((company) => (
            <div key={company} className="flex justify-center items-center grayscale opacity-60 font-bold text-xl text-[#4A3728]">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    name: "Sarah",
    handle: "@sarah_student",
    role: "Student",
    quote: "I saved $500 in one month. So easy!",
    date: "Feb 12, 2026",
    shadowColor: "#E8A0BF",
  },
  {
    name: "Mike",
    handle: "@mike_worker",
    role: "Worker",
    quote: "Now I see where my money goes. Best app ever.",
    date: "Jan 28, 2026",
    shadowColor: "#48C78E",
  },
  {
    name: "Lisa",
    handle: "@lisa_teacher",
    role: "Teacher",
    quote: "I paid off my debt faster. Highly recommend!",
    date: "Dec 15, 2025",
    shadowColor: "#7B91F0",
  },
];

export const Testimonials = () => {
  return (
    <section className="bg-[#FDFBF9] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-[#4A3728] sm:text-4xl">
            What people say
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.handle}
              className="flex flex-col justify-between rounded-xl bg-white p-6 border border-gray-200 relative transition-transform hover:-translate-y-1"
              style={{
                boxShadow: `8px 8px 0px 0px ${testimonial.shadowColor}`,
              }}
            >
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#4A3728] font-bold border border-gray-200">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#4A3728]">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.handle}</div>
                  </div>
                </div>
                <p className="mt-4 text-lg leading-6 text-[#4A3728]">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex gap-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <div className="text-sm text-gray-500">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
