import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const SuccessMessage: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h2>

        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Thank you for applying to join our medical network. Your application
          is now under review. Our team will verify your credentials and get
          back to you within 3-5 business days.
        </p>

        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>
              Application Reference:{" "}
              <span className="font-medium text-gray-700">{`APP-${Date.now()
                .toString()
                .slice(-8)}`}</span>
            </p>
            <p>
              Submitted On:{" "}
              <span className="font-medium text-gray-700">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              You'll receive an email notification once your application has
              been reviewed.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                Go to Dashboard
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
