import { auth } from "@/auth";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Profile</h1>

        <p className="mt-2 text-zinc-400">
          Manage your ResumeIQ account information.
        </p>
      </div>

      {/* User Card */}

      <Card className="border-zinc-800 bg-zinc-950">
        <CardContent className="flex items-center justify-between p-8">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-semibold">{session.user.name}</h2>

              <p className="text-zinc-400">{session.user.email}</p>
            </div>
          </div>

          <Button>Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Account Information */}

      <Card className="mt-6 border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>

          <CardDescription>Personal account details.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm text-zinc-500">Full Name</p>

              <p className="mt-2 font-medium">{session.user.name}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Email</p>

              <p className="mt-2 font-medium">{session.user.email}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Provider</p>

              <p className="mt-2 font-medium">Credentials</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Member Since</p>

              <p className="mt-2 font-medium">June 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}

      <Card className="mt-6 border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle>Security</CardTitle>

          <CardDescription>Manage account security.</CardDescription>
        </CardHeader>

        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
