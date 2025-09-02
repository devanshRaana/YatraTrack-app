import React from 'react';

interface ConsentScreenProps {
    onConsent: () => void;
}

const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in text-white">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-sm">
                <h1 className="text-2xl font-bold mb-4 text-teal-200">Data Collection Consent</h1>
                <p className="text-gray-300 mb-6 text-sm">
                    To improve transportation planning, this app collects trip-related information such as your origin, destination, mode of travel, and number of companions. This data will be anonymized and used by NATPAC scientists for research purposes.
                </p>
                <p className="text-gray-300 mb-8 text-sm">
                    Do you consent to the collection of this data?
                </p>
                <button
                    onClick={onConsent}
                    className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300"
                >
                    I Agree and Consent
                </button>
            </div>
        </div>
    );
};

export default ConsentScreen;