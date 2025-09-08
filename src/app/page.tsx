import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

const LoginIllustration = () => (
    <svg
      className="h-48 w-48 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
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
