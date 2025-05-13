import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { CheckCircle, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Application Confirmed | Healthcare Professional Portal",
  description: "Your doctor application has been successfully processed.",
};

const ApplicationReceivedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Application Confirmed
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for submitting your application to join our healthcare
          professional network. Your information has been successfully received
          and processed.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <h2 className="font-semibold text-blue-800 flex items-center mb-2">
            <Clock className="h-4 w-4 mr-2" />
            Please Note:
          </h2>
          <p className="text-blue-700 text-sm">
            In a real-world (production) environment, your application would go
            through a full verification process that typically takes 2–3
            business days. During that time, our team carefully reviews your
            qualifications before approval.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            Since this is a demonstration environment, your application has been{" "}
            <strong>automatically approved</strong> for testing purposes only.
            This does not reflect a real approval or certification.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/doctor" className="inline-block w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5">
              Return to Dashboard
            </Button>
          </Link>

          <div className="text-sm text-gray-500 flex items-center justify-center">
            <Mail className="h-4 w-4 mr-1" />
            For assistance, contact our provider support team at{" "}
            <a
              href="mailto:support@medplatform.com"
              className="text-primary hover:underline ml-1"
            >
              support@medplatform.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReceivedPage;
