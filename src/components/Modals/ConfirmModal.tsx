import { IconX } from '@tabler/icons-react';

interface ConfirmModalProps {
   isOpen: boolean;
   title?: string;
   description?: string;
   confirmText?: string;
   cancelText?: string;
   onConfirm: () => void;
   onCancel: () => void;
}

export const ConfirmModal = ({
   isOpen,
   title = 'Are you sure?',
   description = '',
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   onConfirm,
   onCancel,
}: ConfirmModalProps) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
         <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
               <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
               <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
               >
                  <IconX size={20} />
               </button>
            </div>

            {description && (
               <p className="text-sm text-gray-600 mb-6">{description}</p>
            )}

            <div className="flex justify-end gap-3">
               <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
               >
                  {cancelText}
               </button>
               <button
                  onClick={onConfirm}
                  className="px-5 py-2 text-sm font-medium rounded-lg bg-[#9E7B9B] text-white hover:bg-[#8B6B8B] transition-colors"
               >
                  {confirmText}
               </button>
            </div>
         </div>
      </div>
   );
};
