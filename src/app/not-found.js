export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
}
