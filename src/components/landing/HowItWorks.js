export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center text-4xl font-bold">How It Works</h2>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold">1. Upload Resume</h3>

          <p className="mt-3 text-zinc-400">Upload your PDF or DOCX resume.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">2. AI Analysis</h3>

          <p className="mt-3 text-zinc-400">
            ResumeIQ analyzes content, keywords, and ATS compatibility.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">3. Improve & Apply</h3>

          <p className="mt-3 text-zinc-400">
            Get actionable insights and increase interview chances.
          </p>
        </div>
      </div>
    </section>
  );
}
