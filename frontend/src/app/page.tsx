import { BackgroundBeams } from "@/components/ui/backgroundBeams";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="bg-custom-radial flex flex-col items-center justify-between min-h-screen md:p-8 pb-20 px-4 pt-10 sm:p-10 font-[family-name:var(--font-geist-sans)] overflow-hidden"
      style={{
        background:
          "linear-gradient(153deg, rgba(210,160,255,1) 9%, rgba(255,255,255,1) 63%)"
      }}
    >
      {/* Intro Section */}
      <div className="flex flex-col items-center text-md text-gray-700 z-10 mb-10">
        This is the developer's application to be used to edit, view and test
        the Food Knowledge Graph Capstone Project.
      </div>

      {/* Main Section */}
      <main className="flex flex-col gap-8 items-center justify-center z-10">
        {/* Logo and Title */}
        <div className="flex gap-4 items-center">
          <Image
            className="dark:invert"
            src="/FKG.svg"
            alt="FKG logo"
            width={140}
            height={38}
          />
          <p className="font-extrabold text-5xl text-wrap py-10">
            The FKG Capstone Project
          </p>
        </div>

        {/* Description */}
        <p className="font-medium text-md text-wrap py-2 text-gray-600 text-center">
          There are 2 methods to query the Knowledge graph - NLP Queries and placeholder queries using forms.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/dashboard/nlp"
            target="_blank"
            rel="noopener noreferrer"
          >
            NLP Query
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/dashboard/forms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forms Query
          </a>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="flex flex-col gap-6 items-center justify-center mt-10 z-10">
        <div className="flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="" // Add the link to the documentation
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="https://nextjs.org/icons/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn more
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/Mansherius/CapstoneProject"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="https://nextjs.org/icons/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to our GitHub →
          </a>
        </div>
        <p className="text-center text-xs text-gray-500">
          Developed by Mansher Singh © 2024 FKG Capstone Project
        </p>
      </footer>

      {/* Background Beams */}
      <BackgroundBeams className="z-0 absolute inset-0" />
    </div>
  );
}
