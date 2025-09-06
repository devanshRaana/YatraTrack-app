import React, { useState } from 'react';
import { Checklist, ChecklistItem } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ChecklistViewProps {
  checklists: Checklist[];
  setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>;
  onBack: () => void;
}

const ChecklistView: React.FC<ChecklistViewProps> = ({ checklists, setChecklists, onBack }) => {
  const [selectedList, setSelectedList] = useState<Checklist | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList: Checklist = {
        id: new Date().toISOString(),
        name: newListName.trim(),
        items: [],
      };
      setChecklists(prev => [newList, ...prev]);
      setNewListName('');
    }
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm("Are you sure you want to delete this checklist?")) {
      setChecklists(prev => prev.filter(list => list.id !== listId));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim() && selectedList) {
      const newItem: ChecklistItem = {
        id: new Date().toISOString(),
        text: newItemText.trim(),
        completed: false,
      };
      setChecklists(prev => prev.map(list => 
        list.id === selectedList.id 
          ? { ...list, items: [...list.items, newItem] } 
          : list
      ));
      setNewItemText('');
    }
  };

  const handleToggleItem = (itemId: string) => {
    if (selectedList) {
      setChecklists(prev => prev.map(list => 
        list.id === selectedList.id
          ? { ...list, items: list.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item) }
          : list
      ));
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (selectedList) {
      setChecklists(prev => prev.map(list => 
        list.id === selectedList.id
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      ));
    }
  };

  // Update selectedList state when checklists prop changes
  React.useEffect(() => {
    if (selectedList) {
      const updatedList = checklists.find(list => list.id === selectedList.id);
      setSelectedList(updatedList || null);
    }
  }, [checklists, selectedList]);

  if (selectedList) {
    const completedCount = selectedList.items.filter(item => item.completed).length;
    const totalCount = selectedList.items.length;

    return (
      <div className="animate-fade-in p-6 h-full flex flex-col">
        <header className="relative flex items-center justify-center mb-6 flex-shrink-0">
          <button onClick={() => setSelectedList(null)} className="absolute left-0 text-teal-600 dark:text-teal-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Go back to checklists">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-200 truncate">{selectedList.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{completedCount} of {totalCount} completed</p>
          </div>
        </header>
        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-3">
          {selectedList.items.length > 0 ? (
            selectedList.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/10 rounded-lg group">
                <div className="flex items-center flex-grow" onClick={() => handleToggleItem(item.id)}>
                  <input type="checkbox" checked={item.completed} readOnly className="h-5 w-5 rounded text-teal-600 focus:ring-teal-500 border-gray-400 dark:border-gray-500 bg-transparent" />
                  <span className={`ml-3 text-gray-800 dark:text-gray-200 ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{item.text}</span>
                </div>
                <button onClick={() => handleDeleteItem(item.id)} className="ml-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 pt-10">No items in this list yet.</p>
          )}
        </div>
        <form onSubmit={handleAddItem} className="mt-4 flex items-center gap-2 flex-shrink-0">
          <input type="text" value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder="Add a new item..." className="flex-grow bg-black/10 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500" />
          <button type="submit" className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700">
            <PlusIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 h-full flex flex-col">
      <header className="relative flex items-center justify-center mb-6 flex-shrink-0">
        <button onClick={onBack} className="absolute left-0 text-teal-600 dark:text-teal-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-200">Travel Checklists</h2>
      </header>
      <div className="flex-grow overflow-y-auto scrollbar-hide space-y-4">
        {checklists.length > 0 ? (
          checklists.map(list => {
            const completedCount = list.items.filter(item => item.completed).length;
            const totalCount = list.items.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            return (
              <div key={list.id} className="p-4 bg-black/5 dark:bg-white/10 rounded-2xl group transition-all hover:scale-105 duration-300">
                <div onClick={() => setSelectedList(list)} className="cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{list.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{completedCount}/{totalCount}</p>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <button onClick={() => handleDeleteList(list.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 pt-10">You have no checklists. Create one below!</p>
        )}
      </div>
      <form onSubmit={handleAddList} className="mt-4 flex items-center gap-2 flex-shrink-0">
        <input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="Create a new checklist..." className="flex-grow bg-black/10 dark:bg-white/10 border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500" />
        <button type="submit" className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700">
            <PlusIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChecklistView;