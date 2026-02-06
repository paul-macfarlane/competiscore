import { auth } from "@/lib/server/auth";
import { cn } from "@/lib/shared/utils";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

import { Button } from "./ui/button";

interface LegalNavProps {
  currentPage: "privacy" | "terms";
}

export async function LegalNav({ currentPage }: LegalNavProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isPrivacy = currentPage === "privacy";

  return (
    <div className="mb-8 space-y-4">
      <div>
        {session ? (
          <Button variant="outline" size="sm" asChild>
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account Settings
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        )}
      </div>

      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <Link
          href="/privacy"
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isPrivacy
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50",
          )}
        >
          <Shield className="mr-2 h-4 w-4" />
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !isPrivacy
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50",
          )}
        >
          <FileText className="mr-2 h-4 w-4" />
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
