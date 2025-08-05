import { useState, useRef } from 'react';
import { IconX, IconPhoto } from '@tabler/icons-react';

interface PhotoModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (files: File[]) => void;
   markerId: string;
}

export const PhotoModal = ({ isOpen, onClose, onSave }: PhotoModalProps) => {
   const [files, setFiles] = useState<File[]>([]);
   const [previews, setPreviews] = useState<string[]>([]);
   const fileInputRef = useRef<HTMLInputElement>(null);

   if (!isOpen) return null;

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);

      // Combine existing and new files
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      // Create previews for new files
      const newPreviews = selectedFiles.map((file) =>
         URL.createObjectURL(file)
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-semibold text-gray-800">
                  Add Photos & Videos
               </h2>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
               >
                  <IconX size={24} />
               </button>
            </div>

            <div
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
               {previews.length > 0 ? (
                  <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4">
                        {previews.map((preview, index) => (
                           <div
                              key={index}
                              className="relative aspect-square group"
                           >
                              <img
                                 src={preview}
                                 alt={`Preview ${index + 1}`}
                                 className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    // Remove the file and preview
                                    setFiles(
                                       files.filter((_, i) => i !== index)
                                    );
                                    setPreviews((prev) => {
                                       URL.revokeObjectURL(prev[index]);
                                       return prev.filter(
                                          (_, i) => i !== index
                                       );
                                    });
                                 }}
                                 className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                 <IconX size={16} />
                              </button>
                           </div>
                        ))}
                        <div
                           onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                           }}
                           className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
                        >
                           <IconPhoto size={24} className="text-gray-400" />
                        </div>
                     </div>
                     <p className="text-sm text-gray-500 text-center">
                        Click on photos to remove them or click the plus icon to
                        add more
                     </p>
                  </div>
               ) : (
                  <div className="flex flex-col items-center gap-3">
                     <IconPhoto size={48} className="text-gray-400" />
                     <div>
                        <p className="text-gray-600 mb-1">
                           Drop your photos here, or
                        </p>
                        <p className="text-blue-500 font-medium">Browse</p>
                     </div>
                  </div>
               )}
            </div>

            <input
               ref={fileInputRef}
               type="file"
               accept="image/*"
               multiple
               onChange={handleFileChange}
               className="hidden"
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
                     onSave(files);
                     setFiles([]);
                     setPreviews([]);
                  }}
                  disabled={files.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Upload
               </button>
            </div>
         </div>
      </div>
   );
};
