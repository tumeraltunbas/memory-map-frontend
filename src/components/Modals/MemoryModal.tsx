import { useState } from 'react';
import { IconX } from '@tabler/icons-react';

interface MemoryModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (text: string) => void;
   markerId: string;
}

export const MemoryModal = ({ isOpen, onClose, onSave }: MemoryModalProps) => {
   const [text, setText] = useState('');

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-semibold text-gray-800">
                  Add Memory Note
               </h2>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
               >
                  <IconX size={24} />
               </button>
            </div>

            <textarea
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder="Write your memory here..."
               className="w-full h-48 p-4 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex justify-end gap-3">
               <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={() => {
                     onSave(text);
                     setText('');
                  }}
                  disabled={!text.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Save
               </button>
            </div>
         </div>
      </div>
   );
};
