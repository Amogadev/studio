import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to your Dashboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have successfully logged in.</p>
        </CardContent>
      </Card>
    </main>
  );
}
