import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="space-y-4">
      <Link href="/dashboard">Dashboard</Link>

      <Link href="/profile">Profile</Link>
    </div>
  );
}
