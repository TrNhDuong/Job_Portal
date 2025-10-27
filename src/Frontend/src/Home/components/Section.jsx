export default function Section({ title, right, children }) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
