import { getPortfolioData } from "@/lib/data";
import PortfolioView from "@/components/PortfolioView";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, experiences, skills, education, projects, certificates } =
    await getPortfolioData();

  return (
    <PortfolioView
      profile={profile}
      experiences={experiences}
      skills={skills}
      education={education}
      projects={projects}
      certificates={certificates}
    />
  );
}