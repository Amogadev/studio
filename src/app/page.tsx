import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative order-2 h-64 lg:order-1 lg:h-screen">
        <Image
          src="https://picsum.photos/1200/1800"
          alt="An abstract background image with blue and purple tones"
          fill
          className="object-cover"
          data-ai-hint="abstract texture"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
      <div className="order-1 flex items-center justify-center p-6 sm:p-12 lg:order-2">
        <LoginForm />
      </div>
    </main>
  );
}
