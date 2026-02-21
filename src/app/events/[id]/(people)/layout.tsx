import { SectionNavigation } from "@/components/section-navigation";
import { ReactNode } from "react";

interface PeopleLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function PeopleLayout({
  children,
  params,
}: PeopleLayoutProps) {
  const { id } = await params;

  const tabs = [
    { label: "Participants", href: `/events/${id}/participants` },
    { label: "Teams", href: `/events/${id}/teams` },
  ];

  return (
    <div className="space-y-4">
      <div className="sticky top-[100px] z-20 -mx-4 px-4 md:-mx-6 md:px-6 py-1 bg-background border-b">
        <SectionNavigation tabs={tabs} />
      </div>
      {children}
    </div>
  );
}
