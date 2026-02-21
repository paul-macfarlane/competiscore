import { SectionNavigation } from "@/components/section-navigation";
import { ReactNode } from "react";

interface ActivityLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function EventActivityLayout({
  children,
  params,
}: ActivityLayoutProps) {
  const { id } = await params;

  const tabs = [
    { label: "Matches", href: `/events/${id}/matches` },
    { label: "Best Scores", href: `/events/${id}/best-scores` },
    { label: "Tournaments", href: `/events/${id}/tournaments` },
    { label: "Discretionary", href: `/events/${id}/discretionary` },
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
