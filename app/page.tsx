import Image from "next/image";

export default function Home() {
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <h1>🚀 Welcome to My Next.js App</h1>

      <p>This is Home Page</p>

      <Image
        src="/next.svg"
        alt="Next Logo"
        width={180}
        height={180}
      />
    </main>
  );
}