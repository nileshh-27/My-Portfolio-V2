import React from "react";

export const Status = (): JSX.Element => {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-[#0b1020] text-white">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold font-['Fira_Code']">
          🚧 Page Under Construction
        </h1>

        <p className="text-gray-300 leading-relaxed text-lg">
          This page is currently being built.  
          Please check back soon for updates!
        </p>

        <div className="mt-4">
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-app-primary to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
};
