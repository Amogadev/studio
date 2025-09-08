
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <main className="grid min-h-screen w-full items-center justify-center md:grid-cols-2">
      <div className="relative hidden h-full items-center justify-center bg-muted/20 p-10 md:flex">
        <div className="relative h-[400px] w-[250px]">
          <Image
            src="/logg_in.png"
            alt="Professional working on a laptop"
            width={250}
            height={400}
            className="rounded-lg object-cover"
            data-ai-hint="professional laptop"
          />
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-center p-6 sm:p-12">
        <LoginForm />
      </div>
    </main>
  );
}
