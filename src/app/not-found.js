import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="text-8xl font-bold">404</h1>

      <h2 className="mt-6 text-3xl font-semibold">Page Not Found</h2>

      <p className="mt-4 max-w-md text-zinc-400">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link href="/dashboard">
        <Button className="mt-8">Go To Dashboard</Button>
      </Link>
    </div>
  );
}
