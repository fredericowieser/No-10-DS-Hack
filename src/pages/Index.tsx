
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Welcome to NHS Health Centre
              </h1>
              <p className="text-lg text-gray-600">
                Navigate to the Patient Portal to access medical services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
