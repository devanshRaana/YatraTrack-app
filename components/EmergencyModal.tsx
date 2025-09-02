import React from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyContacts = [
  { name: 'National Emergency Number', number: '112' },
  { name: 'Police', number: '100' },
  { name: 'Fire', number: '101' },
  { name: 'Ambulance', number: '102' },
  { name: 'Disaster Management', number: '108' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Child Helpline', number: '1098' },
];

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div 
        className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-sm relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 text-center">
            <h2 id="emergency-modal-title" className="text-xl font-bold text-red-400">Emergency Contacts</h2>
            <p className="text-sm text-gray-400">Tap a service to call.</p>
        </div>
        
        <ul className="p-4 space-y-2 max-h-80 overflow-y-auto">
          {emergencyContacts.map(contact => (
            <li key={contact.number}>
              <a 
                href={`tel:${contact.number}`} 
                className="flex items-center justify-between w-full p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="font-semibold">{contact.name}</span>
                <div className="flex items-center space-x-3">
                    <span className="text-lg font-mono text-teal-300">{contact.number}</span>
                    <PhoneIcon className="w-5 h-5 text-teal-300" />
                </div>
              </a>
            </li>
          ))}
        </ul>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close emergency contacts"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default EmergencyModal;
