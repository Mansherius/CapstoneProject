import Image from "next/image";

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
			<div className="flex flex-col items-center text-md text-gray-700">
				This is the developer's application to be used to edit, view and test
				the Food Knowledge Graph Capstone Project.
			</div>
			<main className="flex flex-col gap-8 justify-center md:items-center sm:items-start">
				<div className="flex gap-4">
					<img
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

        <p className="font-medium text-md text-wrap py-2 text-gray-600">
          There are 2 methods to query the Knowledge graph - NLP Queries and placeholder queries.
        </p>

				<div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
					<a
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						NLP Query 
					</a>
					<a
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Placeholder Query
					</a>
        </div>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
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
			</footer>
		</div>
	);
}
