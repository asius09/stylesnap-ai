import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 p-0">
      <div className="bg-white/90 dark:bg-black/70 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch max-w-4xl w-full mx-4 overflow-hidden">
        {/* Left: Free Image */}
        <div className="relative flex-1 min-w-[260px] flex items-center justify-center bg-gradient-to-br from-indigo-200 via-indigo-300 to-indigo-400 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-700">
          <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            FREE IMAGE
          </span>
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="A beautiful mountain landscape"
            width={400}
            height={300}
            className="rounded-lg shadow-lg object-cover m-8"
            priority
          />
        </div>
        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 gap-6">
          <div className="mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Try StyleSnap AI
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">
              Instantly identify and style fashion from any image. Upload a photo and let AI do the rest!
            </p>
          </div>
          {/* Dropdown Area */}
          <div className="mb-4">
            <label htmlFor="style-dropdown" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Choose a style:
            </label>
            <select
              id="style-dropdown"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Powered by</span>
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
