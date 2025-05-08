'use client';

const LandingPage = () => {
  return (
    <div className="bg-gray-50">

      {/* Header Section */}
      <header className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-extrabold mb-4">ATK Result Upload System</h1>
        <p className="text-xl mb-6">Easily upload and manage your ATK test results for quick access and tracking.</p>
        <a
          href="/register"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600"
        >
          Get Started
        </a>
      </header>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload your ATK result securely and instantly, keeping track of your test results with ease.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">1. Upload Your Result</h3>
              <p className="text-gray-700">Easily upload your ATK result by selecting your test image from your device.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">2. Get Instant Validation</h3>
              <p className="text-gray-700">Our system validates your uploaded ATK result and stores it securely for future reference.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">3. View and Track Results</h3>
              <p className="text-gray-700">Access your uploaded results easily and track them at any time through your personal dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Use ATK Upload System?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our system provides a safe and efficient way to upload, track, and manage your ATK test results in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Safe & Secure</h3>
              <p className="text-gray-700">Your data is encrypted and stored securely, ensuring your privacy is maintained at all times.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Easy Access</h3>
              <p className="text-gray-700">Access your results anytime and anywhere, with easy-to-use functionality at your fingertips.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Instant Results</h3>
              <p className="text-gray-700">Receive immediate validation of your ATK results after uploading, saving you time and effort.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white text-center py-16">
        <h2 className="text-3xl font-semibold mb-4">Ready to Upload Your ATK Result?</h2>
        <p className="text-xl mb-8">Start tracking your health by securely uploading your ATK result now!</p>
        <a
          href="/auth/forgot-password"
          className="inline-block bg-green-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-600"
        >
          Upload My Result
        </a>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} ATK Upload System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
