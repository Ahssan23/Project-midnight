
export default function Benefits() {
  const benefits = [
    {
      title: "One place for your fleet",
      description:
        "Add and manage all of your rental vehicles from one dashboard.",
    },
    {
      title: "Your own showroom",
      description:
        "Give customers a simple link to browse the vehicles you offer.",
    },
    {
      title: "Built for rental businesses",
      description:
        "Keep your fleet and rental operations organized as your business grows.",
    },
  ];

  return (
    <section className="border-t border-[#E3E1DC] px-6">
      <div className="mx-auto grid max-w-6xl gap-10 py-16 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title}>
            <h2 className="text-base font-semibold">
              {benefit.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B6B67]">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
