import Hero from "./components/Hero";
import FeaturedJobs from "./components/FeaturedJobs";
import FeaturedBrands from "./components/FeaturedBrands";
import TopSectors from "./components/TopSectors";
import CareerTips from "./components/CareerTips";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import Footer from "./components/Footer.jsx";

export default function HomePage() {
  const { user, login } = useAuth();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user?.email) return;

      try {
        const res = await client.get(
          `/api/candidate?email=${user.email}`
        );
        const candidate = res.data;

        if (candidate) {
          login(candidate); 
        } else {
          console.warn("Không tìm thấy candidate cho email", user.email);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu user:", err);
      }
    };

    fetchCandidate();
  }, [user?.email]);

  return (
    <main className="home-page">
      <div className="home-shell">
        <section className="home-section">
          <Hero />
        </section>

        <section className="home-section">
          <FeaturedJobs enableFetch={true} />
        </section>

        <section className="home-section">
          <FeaturedBrands enableFetch={true} />
        </section>

        <section className="home-section">
          <TopSectors />
        </section>

        <section className="home-section home-section-last">
          <CareerTips />
        </section>
        <Footer />
      </div>
    </main>
  );
}
