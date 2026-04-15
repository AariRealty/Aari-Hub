import ConnectForm from "@/components/ConnectForm";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          Connect with Marlenyi
        </h1>
        <p className="mt-5 text-lg text-neutral-600">
          Please complete this form and I will reach out to you ASAP to connect!
        </p>
      </header>
      <ConnectForm />
    </main>
  );
}
