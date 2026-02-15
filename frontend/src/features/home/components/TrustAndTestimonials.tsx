import { Star } from "lucide-react";

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
    <section className="bg-[#FFFBEB] py-24 sm:py-32 font-quicksand">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] font-patrick sm:text-4xl">
            What people say
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.handle}
              className="flex flex-col justify-between rounded-xl bg-white p-6 border border-[#1F2937]/20 relative transition-transform hover:-translate-y-1"
              style={{ boxShadow: `6px 6px 0 0 ${testimonial.shadowColor}` }}
            >
              <div>
                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#1F2937] font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#1F2937]">{testimonial.name}</div>
                    <div className="text-sm text-[#4B5563]">{testimonial.handle}</div>
                  </div>
                </div>
                <p className="mt-4 text-lg leading-6 text-[#4B5563]">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#1F2937]/10 pt-4">
                <div className="flex gap-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FCD34D] text-[#FCD34D]" />
                  ))}
                </div>
                <div className="text-sm text-[#4B5563]">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
