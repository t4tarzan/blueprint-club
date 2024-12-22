export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Loading...</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we load your content
          </p>
        </div>
      </div>
    </div>
  );
}
