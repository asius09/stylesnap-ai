import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 p-0 font-sans">
      <div className="mx-4 flex w-full max-w-4xl flex-col items-stretch overflow-hidden rounded-2xl bg-white/90 shadow-2xl md:flex-row dark:bg-black/70">
        {/* Left: Free Image */}
        <div className="relative flex min-w-[260px] flex-1 items-center justify-center bg-gradient-to-br from-indigo-200 via-indigo-300 to-indigo-400 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-700">
          <span className="absolute top-4 left-4 z-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            FREE IMAGE
          </span>
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="A beautiful mountain landscape"
            width={400}
            height={300}
            className="m-8 rounded-lg object-cover shadow-lg"
            priority
          />
        </div>
        {/* Right: Content */}
        <div className="flex flex-1 flex-col justify-center gap-6 p-8 md:p-12">
          <div className="mb-2">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              Try StyleSnap AI
            </h1>
            <p className="text-base text-gray-700 sm:text-lg dark:text-gray-300">
              Instantly identify and style fashion from any image. Upload a
              photo and let AI do the rest!
            </p>
          </div>
          {/* Dropdown Area */}
          <div className="mb-4">
            <label
              htmlFor="style-dropdown"
              className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200"
            >
              Choose a style:
            </label>
            <select
              id="style-dropdown"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              defaultValue="casual"
            >
              <option value="casual">Casual</option>
              <option value="streetwear">Streetwear</option>
              <option value="formal">Formal</option>
              <option value="vintage">Vintage</option>
              <option value="sporty">Sporty</option>
            </select>
          </div>
          {/* StyleSnap AI Logo and Badge */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Powered by
              </span>
              <Image
                src="/stylesnap-ai-logo.svg"
                alt="StyleSnap AI Logo"
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
