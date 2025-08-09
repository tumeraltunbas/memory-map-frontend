import { useEffect } from 'react';
import { setHeaderVisibility } from '../MapHeader';

interface ImageViewerProps {
   isOpen: boolean;
   onClose: () => void;
   imageUrl: string;
   onNext?: () => void;
   onPrev?: () => void;
   hasNext?: boolean;
   hasPrev?: boolean;
}

export const ImageViewer = ({
   isOpen,
   onClose,
   imageUrl,
   onNext,
   onPrev,
   hasNext = false,
   hasPrev = false,
}: ImageViewerProps) => {
   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         switch (e.key) {
            case 'ArrowRight':
               if (hasNext && onNext) onNext();
               break;
            case 'ArrowLeft':
               if (hasPrev && onPrev) onPrev();
               break;
            case 'Escape':
               onClose();
               break;
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, onNext, onPrev, hasNext, hasPrev, onClose]);

   useEffect(() => {
      setHeaderVisibility(!isOpen);
      return () => setHeaderVisibility(true);
   }, [isOpen]);
   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-lg flex items-center justify-center"
         onClick={onClose}
      >
         <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-all duration-200 p-3 rounded-full hover:bg-white/10 group"
            title="Close (Esc)"
         >
            <svg
               className="w-8 h-8 transform group-hover:rotate-90 transition-transform duration-200"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
               />
            </svg>
         </button>

         {hasPrev && (
            <button
               onClick={(e) => {
                  e.stopPropagation();
                  onPrev?.();
               }}
               className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
               <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M15 19l-7-7 7-7"
                  />
               </svg>
            </button>
         )}

         {hasNext && (
            <button
               onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
               }}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
               <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M9 5l7 7-7 7"
                  />
               </svg>
            </button>
         )}

         <div
            className="w-full h-full p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
         >
            <img
               src={imageUrl}
               alt="Full size"
               className="max-w-full max-h-full object-contain select-none"
               draggable={false}
            />
         </div>

         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm flex items-center gap-4">
            {hasPrev && (
               <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
                  Previous
               </span>
            )}
            {hasNext && (
               <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
                  Next
               </span>
            )}
         </div>
      </div>
   );
};
