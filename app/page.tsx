import { Link } from 'next-view-transitions';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Welcome to SmartRoom</h1>
        <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          A comprehensive room control system for managing spaces, products, and client access.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage rooms, products, and users with full control
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Worker Interface
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assign clients to rooms and manage inventory
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Client Access
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View available products and make purchases
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
