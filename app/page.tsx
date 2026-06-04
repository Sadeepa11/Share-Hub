import Link from "next/link";
import Image from "next/image";
import { Truck, Leaf, Clock, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col">

        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-app-green">
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-0 w-96 h-96 rounded-full bg-app-orange opacity-5 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-app-green-lighter opacity-10 blur-3xl" />
          </div>

          <div className="w-[90%] mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

              {/* Left: Text */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-app-green-light text-app-orange text-sm font-semibold mb-8 border border-app-green-lighter">
                  <Leaf className="w-4 h-4" />
                  Donation Platform
                </span>

                <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl text-white leading-tight mb-6">
                  Share<span className="text-app-orange italic"> Hub.</span>
                </h1>

                <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-light mb-10">
                  A curated space to donate unneeded items, books, and supplies.
                  Minimal waste, maximum community impact.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/posts/create"
                    className="px-8 py-4 bg-app-orange text-white text-sm font-semibold rounded-xl hover:bg-app-orange-dark transition-colors shadow-lg shadow-orange-900/20"
                  >
                    Start Sharing
                  </Link>
                  <Link
                    href="/posts"
                    className="px-8 py-4 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Browse Items
                  </Link>
                </div>

                {/* Mini feature cards */}
                <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
                  {[
                    { icon: Truck, title: "Campus Pickup", desc: "Zero shipping" },
                    { icon: Leaf, title: "Zero Waste", desc: "Eco-friendly" },
                    { icon: Clock, title: "Same Day", desc: "Fast handoffs" },
                    { icon: ShieldCheck, title: "Verified", desc: "Safe & trusted" },
                  ].map(({ icon: Icon, title, desc }, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="w-9 h-9 rounded-lg bg-app-orange/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-app-orange" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">{title}</p>
                        <p className="text-white/50 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="flex-1 flex justify-center items-center w-full">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 rounded-full bg-app-green-lighter opacity-15 blur-2xl scale-90" />
                  <Image
                    src="/hero-illustration.svg"
                    alt="People sharing and donating items"
                    width={520}
                    height={440}
                    className="relative w-full h-auto drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="py-24 bg-app-cream border-t border-app-border">
          <div className="w-[90%] mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-4xl md:text-5xl text-app-green mb-4">
                Designed for the Community
              </h2>
              <p className="text-app-text-light text-lg max-w-xl mx-auto">
                Everything you need to donate, discover, and connect — all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  img: "/img-curate.svg",
                  num: "01",
                  title: "Curate",
                  desc: "Post books, electronics, or dorm supplies. Clean, simple, and beautiful.",
                },
                {
                  img: "/img-connect.svg",
                  num: "02",
                  title: "Connect",
                  desc: "Meet people right in your community. No shipping, no fees, no friction.",
                },
                {
                  img: "/img-trust.svg",
                  num: "03",
                  title: "Trust",
                  desc: "Verified platform. Safe, monitored, and transparent for everyone.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 border border-app-border hover:shadow-lg hover:shadow-app-green/5 transition-all hover:-translate-y-0.5 flex flex-col items-center text-center">
                  <div className="w-28 h-28 mb-6">
                    <Image src={feature.img} alt={feature.title} width={112} height={112} className="w-full h-full" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-app-green flex items-center justify-center text-app-orange text-xs font-bold mb-4">
                    {feature.num}
                  </div>
                  <h3 className="text-xl font-semibold text-app-green mb-3">{feature.title}</h3>
                  <p className="text-app-text-light leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section className="py-24 bg-white">
          <div className="w-[90%] mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-4xl md:text-5xl text-app-green mb-4">
                How It Works
              </h2>
              <p className="text-app-text-light text-lg max-w-xl mx-auto">
                Three simple steps to give your items a second life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-[72px] left-[calc(16.67%+48px)] right-[calc(16.67%+48px)] h-0.5 bg-gradient-to-r from-app-border via-app-orange/30 to-app-border" />

              {[
                {
                  img: "/img-step1.svg",
                  step: "01",
                  title: "List Your Item",
                  desc: "Snap a photo, add a brief description, and list your unneeded items on the platform in seconds.",
                },
                {
                  img: "/img-step2.svg",
                  step: "02",
                  title: "Receive Requests",
                  desc: "People in the community can request your items. You review and approve at your discretion.",
                },
                {
                  img: "/img-step3.svg",
                  step: "03",
                  title: "Make the Exchange",
                  desc: "Coordinate a safe, convenient meetup to hand off the item. Zero shipping, zero fees.",
                },
              ].map((process, idx) => (
                <div key={idx} className="flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 mb-5 relative">
                    <div className="absolute inset-0 rounded-2xl bg-app-cream" />
                    <Image src={process.img} alt={process.title} width={96} height={96} className="relative w-full h-full p-2" />
                  </div>
                  <div className="w-10 h-10 bg-app-green rounded-xl flex items-center justify-center text-app-orange font-bold text-sm mb-5 shadow-md shadow-app-green/20">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-semibold text-app-green mb-3">{process.title}</h3>
                  <p className="text-app-text-light leading-relaxed max-w-xs">{process.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="py-24 bg-app-green">
          <div className="w-[90%] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: "10K+", label: "Items Shared" },
                { number: "5K+", label: "Active Members" },
                { number: "0$", label: "Platform Fees" },
                { number: "100%", label: "Sustainable" },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-5xl md:text-6xl font-bold text-app-orange mb-2">{stat.number}</h3>
                  <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="py-28 bg-app-cream overflow-hidden">
          <div className="w-[90%] mx-auto">
            <div className="bg-app-green rounded-3xl px-10 py-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
              {/* Background decoration -->*/}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-app-green-lighter opacity-30" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-app-orange opacity-10" />

              {/* Text */}
              <div className="flex-1 text-center lg:text-left relative z-10">
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
                  Ready to Declutter?
                </h2>
                <p className="text-white/70 text-lg max-w-lg mb-8">
                  Join thousands of people building a more sustainable and generous community.
                </p>
                <Link
                  href="/register"
                  className="inline-block px-10 py-4 bg-app-orange text-white text-base font-semibold rounded-xl hover:bg-app-orange-dark transition-colors shadow-lg"
                >
                  Join Share Hub
                </Link>
              </div>

              {/* Illustration */}
              <div className="relative z-10 flex-shrink-0">
                <Image
                  src="/img-step3.svg"
                  alt="Community exchange"
                  width={180}
                  height={180}
                  className="opacity-90"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-app-green text-white pt-16 pb-10">
        <div className="w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-app-green-light rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-app-orange" />
                </div>
                <span className="font-bold text-xl">
                  Share<span className="text-app-orange">Hub</span>
                </span>
              </div>
              <p className="text-white/60 font-light max-w-xs leading-relaxed">
                A curated space to donate unneeded items, books, and supplies. Minimal waste, maximum impact.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-white mb-1">Platform</h4>
              <Link href="/posts" className="text-white/60 hover:text-white text-sm transition-colors">Browse Items</Link>
              <Link href="/register" className="text-white/60 hover:text-white text-sm transition-colors">Get Started</Link>
              <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">Sign In</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-white mb-1">Legal</h4>
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">Community Guidelines</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Share Hub. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Designed for the Community
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
