import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

const UserIllustration = () => (
  <svg
    className="h-48 w-48 rounded-full bg-primary/10 p-4 text-primary"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <defs>
      <clipPath id="circle-clip">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
    </defs>
    <g clipPath="url(#circle-clip)">
      <circle cx="50" cy="50" r="50" fill="white" />
      <g transform="translate(0, 5)">
        <circle cx="50" cy="35" r="12" fill="#FFDDC1" />
        <path
          d="M38,47 C38,55 42,58 50,58 C58,58 62,55 62,47 L38,47 Z"
          fill="#FFDDC1"
        />
        <path
          d="M30 95 L70 95 L70 85 C70 80 65 75 60 75 L40 75 C35 75 30 80 30 85 Z"
          fill="#4A5568"
        />
        <rect x="25" y="60" width="50" height="20" rx="5" fill="#E2E8F0" />
        <rect x="45" y="65" width="10" height="10" fill="#CBD5E0" />

        <path
          d="M 50 23 C 40 23, 35 30, 35 38 L 65 38 C 65 30, 60 23, 50 23 Z"
          fill="#2D3748"
        />
        <path
          d="M48,60 l-10,-10 a5,5 0 0,1 0,-7 l5,-5 L 48,60"
          fill="#4A5568"
        />
        <path
          d="M52,60 l10,-10 a5,5 0 0,0 0,-7 l-5,-5 L 52,60"
          fill="#4A5568"
        />
        <rect x="48" y="47" width="4" height="4" rx="1" fill="#E53E3E" />
      </g>
    </g>
  </svg>
);


export default function Home() {
  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative order-2 flex items-center justify-center bg-muted/20 p-10 lg:order-1">
        <UserIllustration />
      </div>
      <div className="order-1 flex items-center justify-center p-6 sm:p-12 lg:order-2">
        <LoginForm />
      </div>
    </main>
  );
}
