import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>

        <p className="mt-2 text-zinc-400">Manage your ResumeIQ preferences.</p>
      </div>

      {/* Notifications */}

      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>

          <CardDescription>Control notifications and alerts.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>

              <p className="text-sm text-zinc-500">Receive product updates.</p>
            </div>

            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Job Match Alerts</p>

              <p className="text-sm text-zinc-500">
                Notify when jobs match your profile.
              </p>
            </div>

            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}

      <Card className="mt-6 border-zinc-800 bg-zinc-950">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>

          <CardDescription>Customize your experience.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>

              <p className="text-sm text-zinc-500">Enabled by default.</p>
            </div>

            <Switch checked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}

      <Card className="mt-6 border-red-900 bg-zinc-950">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>

          <CardDescription>Permanent actions.</CardDescription>
        </CardHeader>

        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
