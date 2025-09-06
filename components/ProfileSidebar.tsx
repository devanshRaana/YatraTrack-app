import React from 'react';
import type firebase from 'firebase/compat/app';
import { XMarkIcon } from './icons/XMarkIcon';
import { UserIcon } from './icons/UserIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { OtherIcon } from './icons/OtherIcon'; // Reusing for Help
import { LogoutIcon } from './icons/LogoutIcon';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: firebase.User | null;
  onLogout: () => void;
  onNavigateToSettings: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose, user, onLogout, onNavigateToSettings }) => {

  const menuItems = [
    { text: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, action: onNavigateToSettings },
    { text: 'Help & Support', icon: <OtherIcon className="w-5 h-5" />, action: () => {} },
    { text: 'Logout', icon: <LogoutIcon className="w-5 h-5" />, action: onLogout },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-sidebar-title"
      >
        <div className="flex flex-col h-full text-gray-900 dark:text-white">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="profile-sidebar-title" className="text-xl font-bold text-teal-600 dark:text-teal-300">
              Profile
            </h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label="Close profile sidebar">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="p-6 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                    <UserIcon className="w-10 h-10 text-teal-500 dark:text-teal-300" />
                )}
            </div>
            <div>
                <p className="font-bold text-lg truncate">{user?.displayName || 'Traveler'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || 'No email provided'}</p>
            </div>
          </div>

          <nav className="flex-grow p-4">
            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={item.action}
                            className="w-full flex items-center gap-4 p-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <span className="text-teal-600 dark:text-teal-400">{item.icon}</span>
                            <span>{item.text}</span>
                        </button>
                    </li>
                ))}
            </ul>
          </nav>

          <footer className="p-4 mt-auto text-center text-xs text-gray-400 dark:text-gray-500">
            YatraTrack v1.1.0
          </footer>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;