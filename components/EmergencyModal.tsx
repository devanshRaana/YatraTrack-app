import React, { useState } from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EmergencyContact } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalContacts: EmergencyContact[];
  setPersonalContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
}

const officialContacts = [
  { name: 'National Emergency Number', number: '112' },
  { name: 'Police', number: '100' },
  { name: 'Fire', number: '101' },
  { name: 'Ambulance', number: '102' },
  { name: 'Disaster Management', number: '108' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Child Helpline', number: '1098' },
];

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, personalContacts, setPersonalContacts }) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContactName.trim() && newContactNumber.trim()) {
      const newContact: EmergencyContact = {
        id: new Date().toISOString(),
        name: newContactName.trim(),
        number: newContactNumber.trim(),
      };
      setPersonalContacts(prev => [...prev, newContact]);
      setNewContactName('');
      setNewContactNumber('');
    }
  };

  const handleDeleteContact = (id: string) => {
    setPersonalContacts(prev => prev.filter(contact => contact.id !== id));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div 
        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-xl w-full max-w-sm relative animate-fade-in-up flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-200 dark:border-gray-700 text-center flex-shrink-0">
            <h2 id="emergency-modal-title" className="text-xl font-bold text-red-600 dark:text-red-400">Emergency Contacts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tap a service to call.</p>
        </header>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Personal Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">PERSONAL CONTACTS</h3>
            {personalContacts.length > 0 ? (
              <ul className="space-y-2">
                {personalContacts.map(contact => (
                  <li key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 group">
                    <a href={`tel:${contact.number}`} className="flex-grow flex items-center justify-between mr-2">
                      <div>
                        <span className="font-semibold">{contact.name}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{contact.number}</p>
                      </div>
                      <PhoneIcon className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                    </a>
                    <button onClick={() => handleDeleteContact(contact.id)} className="p-1 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-3">No personal contacts added.</p>
            )}
            <form onSubmit={handleAddContact} className="mt-3 flex items-center gap-2">
                <input type="text" value={newContactName} onChange={e => setNewContactName(e.target.value)} placeholder="Name" className="flex-1 bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm" />
                <input type="tel" value={newContactNumber} onChange={e => setNewContactNumber(e.target.value)} placeholder="Number" className="flex-1 bg-black/5 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm" />
                <button type="submit" className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 text-sm">Add</button>
            </form>
          </div>

          {/* Official Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">OFFICIAL NUMBERS</h3>
            <ul className="space-y-2">
              {officialContacts.map(contact => (
                <li key={contact.number}>
                  <a 
                    href={`tel:${contact.number}`} 
                    className="flex items-center justify-between w-full p-4 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="font-semibold">{contact.name}</span>
                    <div className="flex items-center space-x-3">
                        <span className="text-lg font-mono text-teal-600 dark:text-teal-300">{contact.number}</span>
                        <PhoneIcon className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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