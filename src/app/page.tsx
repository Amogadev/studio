import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="grid w-full max-w-4xl grid-cols-1 overflow-hidden shadow-2xl md:grid-cols-2">
        <div className="relative flex items-center justify-center bg-muted/20 p-8">
          <Image
            src="https://picsum.photos/600/600"
            alt="Person working on a laptop"
            width={400}
            height={400}
            className="rounded-lg object-contain"
            data-ai-hint="professional focused"
          />
        </div>
        <div className="flex items-center justify-center p-8">
          <LoginForm />
        </div>
      </Card>
    </main>
  );
}
