"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      className="
        flex
        items-center
        gap-2
        rounded-lg
        border
        border-zinc-800
        bg-zinc-950
        px-4
        py-2
        text-sm
        hover:bg-zinc-900
        transition
      "
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
