export default function PageHeader({ title, description }) {
  return (
    <div>
      <h1 className="text-5xl font-bold tracking-tight">{title}</h1>

      <p className="mt-4 text-lg text-zinc-400">{description}</p>
    </div>
  );
}
