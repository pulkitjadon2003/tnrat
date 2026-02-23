

export default function OurMission() {
  const missionPoints = [
    {
      title: "Our Mission",
      description:
        "To serve humanity through community development, education, and social welfare programs inspired by Islamic values.",
    },
    {
      title: "Our Vision",
      description:
        "To create a society grounded in Islamic principles where every individual lives with dignity, faith, and purpose.",
    },
  ];

  return (
    <section
      className="bg-green-50 pb-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {missionPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-green-100 text-center"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                {point?.title}
              </h3>
              <p className="text-green-700">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
