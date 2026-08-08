import { getPortfolioData } from "@/lib/data";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { profile, experiences, skills, education, projects, certificates } =
    await getPortfolioData();

  return (
    <AdminDashboard
      profile={profile}
      experiences={experiences}
      skills={skills}
      education={education}
      projects={projects}
      certificates={certificates}
    />
  );
}
