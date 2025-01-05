import React, { useState } from 'react';
import Layout from './layout';
import DashboardChat from './page';


function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
  };

  return (
    <Layout>
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-lg text-center border border-customLightBlue">
            <h1 className="text-2xl font-bold mb-4">Disclaimer</h1>
            <p className="mb-4">
              This application is not endorsed, affiliated with, or promoted by Andrew Huberman. It is an independent educational project created as part of a learning exercise during my master's program. The project applies skills learned in Data Engineering and Data Analytics.
            </p>
            <p className="mb-4">
              Users can explore podcast analytics, sentiment analysis, and tailored recommendations powered by GPT-4o. Please note that all data and features are for informational purposes only.
            </p>
            <button
              onClick={handleCloseDisclaimer}
              className="mt-4 px-4 py-2  bg-gray-800 text-white rounded-lg hover:bg-customLightBlue hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <DashboardChat/>
    </Layout>
  );
}

export default App;
