

export default function Home() {
  return (
        <div className="flex justify-center mt-10">
          <div className="max-w-6xl text-center">
            <h1 className="px-5 text-6xl text-indigo-900 text-opacity-30 font-serif uppercase text-center mt-10">The most comprehensive roof tracking system on the market</h1>
            <p className="px-8 text-lg text-gray-600 text-center mt-10">RoofTrack is a powerful tool designed to streamline the process of managing roofing leads, inspections, and contractor assignments. Our platform offers a   user-friendly interface that allows roofing professionals to efficiently  track and organize their workflow from initial contact to project  completion.</p>
            <div className="flex justify-center space-x-6 mt-10">
              <button className="p-3 px-5 rounded-3xl shadow-xl border-blue-900 bg-indigo-900 text-yellow-300 font-bold border-2 hover:scale-108 hover:shadow-2xl transition-all duration-300">See Demo</button>
              <button className="p-3 px-6 rounded-3xl shadow-xl border-blue-900 bg-yellow-300 text-indigo-900 font-bold hover:scale-108 hover:shadow-2xl transition-all duration-300">View Pricing</button>
            </div>
            <div className="bg-indigo-800 rounded-3xl mt-20 p-10 shadow-xl">
              <h3 className="px-5 text-4xl text-yellow-300 text-opacity-30 font-serif uppercase text-center mb-12 mt-20">Lead Features</h3>
              <div className="grid grid-cols-3 gap-6 mt-10 flex-wrap">
                <div className="p-6 bg-indigo-700 rounded-2xl shadow-2xl hover:bg-indigo-500 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-yellow-50 mb-4">Knock Management</h4>
                  <p className="text-yellow-300">Efficiently manage and track roof Door-Knocks with our interactive map systems.</p>
                </div>
                <div className="p-6 bg-indigo-700 rounded-2xl shadow-2xl hover:bg-indigo-500 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl text-yellow-50 font-bold mb-4">Lead Management</h4>
                  <p className="text-yellow-300">Easily track and manage your roofing leads with our intuitive lead management system.</p>
                </div>
                <div className="p-6 bg-indigo-700 rounded-2xl shadow-2xl hover:bg-indigo-500 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-yellow-50 mb-4">Inspection Scheduling</h4>
                  <p className="text-yellow-300">Schedule and organize roof inspections seamlessly within the platform.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-300 rounded-3xl mt-20 p-10 shadow-xl">
              <h3 className="px-5 text-4xl text-indigo-900 text-opacity-30 font-serif uppercase text-center mb-12 mt-20">Prospect Features (coming soon)</h3>
              <div className="grid grid-cols-3 gap-6 mt-10 flex-wrap">
                <div className="p-6 bg-gray-200 rounded-2xl shadow-2xl hover:bg-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-indigo-900 mb-4">Track Insurance Claims</h4>
                  <p className="text-indigo-800">Monitor and manage insurance claims for your roofing projects efficiently.</p>
                </div>
                <div className="p-6 bg-gray-200 rounded-2xl shadow-2xl hover:bg-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl text-indigo-900 font-bold mb-4">Track Retail Sales</h4>
                  <p className="text-indigo-800">Easily track and quote your roofing retail sales with our intuitive system.</p>
                </div>
                <div className="p-6 bg-gray-200 rounded-2xl shadow-2xl hover:bg-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-indigo-900 mb-4">Communicate Interdepartmentally</h4>
                  <p className="text-indigo-800">Easily communicate and collaborate across departments within the platform.</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-300 rounded-3xl mt-20 p-10 shadow-xl">
              <h3 className="px-5 text-4xl text-gray-900 text-opacity-30 font-serif uppercase text-center mb-12 mt-20">Build Features(coming soon)</h3>
              <div className="grid grid-cols-3 gap-6 mt-10 flex-wrap">
                <div className="p-6 bg-amber-300 rounded-2xl shadow-2xl hover:bg-amber-400 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-gray-700 mb-4">Track Product Shipping</h4>
                  <p className="text-gray-600">Know when products are shipped and track their delivery status within the platform.</p>
                </div>
                <div className="p-6 bg-amber-300 rounded-2xl shadow-2xl hover:bg-amber-400 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl text-gray-700 font-bold mb-4">Supplement missing line items</h4>
                  <p className="text-gray-600">Easily supplement missing line items in your roofing invoices with our intuitive system.</p>
                </div>
                <div className="p-6 bg-amber-300 rounded-2xl shadow-2xl hover:bg-amber-400 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-gray-700 mb-4">Confirm Quality Control</h4>
                  <p className="text-gray-600">Track the build quality of your roofing projects and confirm quality control checkpoints.</p>
                </div>
              </div>
            </div>
            <div className=" mt-20 p-10">
              <h3 className="px-5 text-4xl text-yellow-800 text-opacity-30 font-serif uppercase text-center mb-12 mt-20">Invoice Features(coming soon)</h3>
              <div className="grid grid-cols-3 gap-6 mt-10 flex-wrap">
                <div className="p-6 bg-amber-200 rounded-2xl shadow-2xl hover:bg-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-indigo-800 mb-4">Confirm the receipt of documents</h4>
                  <p className="text-gray-600">Verify that documents have been received and acknowledged by clients within the platform.</p>
                </div>
                <div className="p-6 bg-amber-200 rounded-2xl shadow-2xl hover:bg-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-indigo-800 mb-4">Send a quick invoice</h4>
                  <p className="text-gray-600">Easily send quick invoices to clients with our intuitive invoice system.</p>
                </div>
                <div className="p-6 bg-amber-200 rounded-2xl shadow-2xl hover:bg-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-indigo-800 mb-4">Easily bill customers</h4>
                  <p className="text-gray-600">Send an invoice to customers with our easy-to-use billing system.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
