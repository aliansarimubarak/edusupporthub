import { useEffect, useState } from "react";

const slides = [
  {
    image: "/2.jpg",
    title: "Guided help that strengthens your learning",
    text: "Students receive step-by-step explanations, not ready-made submissions.",
  },
  {
    image: "/3.jpg",
    title: "Built for academic integrity",
    text: "Every interaction encourages responsible use—your work stays uniquely yours.",
  },
  {
    image: "/4.jpg",
    title: "Expert support when you need it most",
    text: "Connect with verified tutors who help you understand challenging topics deeply.",
  },
    {
    image: "/5.jpg",
    title: "Expert support when you need it most",
    text: "Connect with verified tutors who help you understand challenging topics deeply.",
  },
];

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance slider every 6 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-slate-50">
      {/* HERO SECTION */}
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center">
          {/* Left column */}
          <div className="flex-1 space-y-4">
            <p className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
              Designed for honest learning
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Academic help that{" "}
              <span className="text-indigo-600">respects integrity.</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              EduSupportHub connects students with verified experts for
              assignments, projects, and tutoring—within clear academic
              integrity guidelines. Get the support you need while keeping your
              institution&apos;s honor code front and center.
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="/login"
                className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Get started as a student
              </a>
              <a
                href="/register"
                className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600"
              >
                Join as an expert
              </a>
            </div>

            <p className="text-[11px] text-slate-500">
              Work is provided for learning and reference only. We never
              encourage submitting expert work as your own.
            </p>
          </div>

          {/* Right column – hero image with overlay card */}
          <div className="flex-1">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl bg-slate-900/5 shadow-md">
              <img
                src="/1.jpg"
                alt="Students studying with support"
                className="h-64 w-full object-cover md:h-80"
              />

              {/* Overlay honor card */}
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/80 px-4 py-3 text-slate-50 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-200">
                      EduSupportHub Honor Promise
                    </p>
                    <p className="text-[11px] text-slate-100">
                      Built to support—not replace—your own work.
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-200">
                  Experts and students agree to use solutions for understanding,
                  practice, and feedback—not cheating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-slate-900">
            Built for responsible help—not shortcuts.
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Students get guidance. Experts share their knowledge. Everyone
            understands that learning—not cheating—is the goal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Transparent expectations
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Every order includes an explicit reminder that expert work is for
              reference and practice. Students are encouraged to adapt,
              summarize, and cite—not copy.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Verified experts
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Experts complete detailed profiles and can be reviewed and rated
              by students. You can see their track record before you choose.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Clear audit trail
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Chats, files, and status changes are stored securely, so
              institutions can reconstruct how help was provided if needed.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="border-y bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-300">
              How EduSupportHub works
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              From question to clarity, in four simple steps.
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              The workflow is designed to keep you in control and aligned with
              your course&apos;s academic integrity policies.
            </p>
          </div>

          <div className="flex-1 space-y-3 text-xs text-slate-100">
            <div className="flex gap-3 rounded-xl bg-slate-800/70 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-white">
                  Post your assignment with clear context
                </p>
                <p className="mt-1 text-slate-300">
                  Describe what you&apos;re working on, your deadline, and what
                  kind of explanation you&apos;re looking for—not just “the
                  answer.”
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl bg-slate-800/70 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-white">
                  Compare offers from experts
                </p>
                <p className="mt-1 text-slate-300">
                  Review bids, profiles, and ratings. Choose someone who matches
                  your subject, level, and budget.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl bg-slate-800/70 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-white">
                  Learn through guided solutions
                </p>
                <p className="mt-1 text-slate-300">
                  Ask questions, request clarifications, and use worked examples
                  to build your own understanding—not a copy-paste submission.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl bg-slate-800/70 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-white">
                  Close the order & leave a review
                </p>
                <p className="mt-1 text-slate-300">
                  When you&apos;re confident with the material, complete the
                  order, release payment, and rate your expert to help others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDER SECTION WITH IMAGES */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Why students choose EduSupportHub
            </h2>
            <p className="text-xs text-slate-600">
              Real experiences showing how guided learning improves results.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md">
          {/* Image */}
          <div className="h-64 w-full overflow-hidden md:h-100">
            <img
              src={slides[activeSlide].image}
              alt={slides[activeSlide].title}
              className="h-full w-full object-cover transition-all duration-700"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
              Student Stories · Slide {activeSlide + 1} of {slides.length}
            </p>

            <h3 className="mt-2 text-sm font-semibold text-slate-900">
              {slides[activeSlide].title}
            </h3>

            <p className="mt-2 text-xs text-slate-600">
              {slides[activeSlide].text}
            </p>
          </div>

          {/* Controls */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
            <button
              onClick={prevSlide}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow hover:bg-white"
              type="button"
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow hover:bg-white"
              type="button"
            >
              ▶
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 pb-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  activeSlide === i
                    ? "bg-indigo-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATORS SECTION */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              For instructors and institutions
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              EduSupportHub is designed to complement your teaching—not compete
              with it. Share your syllabus and integrity policies with students,
              and we&apos;ll reinforce them with:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Customizable disclaimers on orders and messages.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Clear separation between exam help (restricted) and general
                learning support.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Exportable logs to aid internal academic integrity reviews.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-4 text-xs text-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
              Interested in partnering?
            </p>
            <p className="mt-1">
              If you represent a department or institution and want to define
              specific guidelines for your students on EduSupportHub, reach out
              to us.
            </p>
            <a
              href="/contact"
              className="mt-3 inline-block rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-700"
            >
              Contact our team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
