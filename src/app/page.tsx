export default function HomePage() {
  return (
    <main className="app-container flex min-h-dvh flex-col items-start justify-center gap-6 py-12">
      <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
        Pre-launch
      </span>
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-neutral-900">
        Catat singkat,
        <br />
        belanja tepat.
      </h1>
      <p className="text-lg leading-relaxed text-neutral-700">
        Asisten belanja harian buat pedagang makanan kecil. 30 detik catat, besok udah tahu mau
        belanja berapa.
      </p>
      <a
        href="/dashboard"
        className="inline-flex h-14 items-center justify-center rounded-[12px] bg-brand-500 px-6 text-base font-semibold text-neutral-50 transition-colors hover:bg-brand-600"
      >
        Mulai siapin warung
      </a>
      <p className="text-sm text-neutral-500">
        Buat pedagang pecel lele, warteg, gorengan, kaki lima.
      </p>
    </main>
  );
}
