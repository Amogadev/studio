import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

const LoginIllustration = () => (
    <svg
      className="h-64 w-64 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
      <path d="M12 16a2 2 0 0 1-2-2v-2a2 2 0 1 1 4 0v2a2 2 0 0 1-2 2Z" />
    </svg>
  );


export default function Home() {
  return (
    <main className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:flex items-center justify-center bg-muted/20 p-10">
        <LoginIllustration />
      </div>
      <div className="col-span-1 flex items-center justify-center p-6 sm:p-12">
        <LoginForm />
      </div>
    </main>
  );
}
