export default function Metrics() {
  const Item = ({ big, small }) => (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-extrabold text-indigo-600">{big}</div>
      <div className="text-gray-600">{small}</div>
    </div>
  );
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8 mt-6">
      <Item big="100k+" small="Active Jobs" />
      <Item big="10k+" small="Companies" />
      <Item big="500+" small="CV Template" />
    </div>
  );
}
