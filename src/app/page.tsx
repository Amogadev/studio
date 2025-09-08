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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );


export default function Home() {
  return (
    <main className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:flex flex-col items-center justify-center bg-muted/20 p-10">
        <h1 className="text-4xl font-bold text-primary mb-4">Hi,</h1>
        <LoginIllustration />
      </div>
      <div className="col-span-1 flex items-center justify-center p-6 sm:p-12">
        <LoginForm />
      </div>
    </main>
  );
}
