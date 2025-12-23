import { ApiStatusComponent } from "./_components/api-status-component";
import { HeroSection } from "./_components/hero-section";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <div className="flex justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <ApiStatusComponent />
        </div>
      </div>
    </main>
  );
}
