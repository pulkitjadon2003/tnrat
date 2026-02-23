import AboutSection from "@/components/AboutSection";
import AchievementSection from "@/components/Achievement";
import HeroSection from "@/components/HeroSection";
import JoinMission from "@/components/JoinMission";
import OurMission from "@/components/OurMission";
import RecentActivities from "@/components/RecentActivities"

export default function Home() {
  return (
    <div className="bg-white text-black">
      <HeroSection />
      <OurMission />
      <RecentActivities />
      <AchievementSection />
      <JoinMission />
      <AboutSection />
      <JoinMission />
    </div>
  );
}