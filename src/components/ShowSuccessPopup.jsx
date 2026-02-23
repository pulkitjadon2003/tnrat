'use client';
import { useSelector } from "react-redux";

export default function ShowSuccessPopup({ showSuccessPopup, setShowSuccessPopup, membershipId }) {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowSuccessPopup(false)} // optional: close when clicking outside
          ></div>

          {/* Center white box */}
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-lg transform transition-all duration-300 scale-100">
            {/* Close Icon (top-right) */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Popup Content */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Application Submitted Successfully!
              </h3>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"> 
               <p className="text-green-800 font-medium mb-2">Your Transaction ID:</p>
                <p className="text-2xl font-bold text-green-600">{membershipId}</p> 
               </div>

              <p className="text-gray-600">
                We will verify your documents and contact you soon. Please keep
                your Transaction ID for future reference.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
