import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <main className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:flex flex-col items-center justify-center bg-muted/20 p-10">
        <div className="relative h-[600px] w-[400px]">
          <Image
            src="/log_in.png"
            alt="Login illustration"
            width={400}
            height={600}
            className="object-cover rounded-lg"
            data-ai-hint="login illustration"
          />
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-center p-6 sm:p-12">
        <LoginForm />
      </div>
    </main>
  );
}
