import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { markdownAPI } from '../../services/markdownApi';
import type { MarkdownResponse } from '../../services/markdownApi';
import { setError, setLoading } from '../../stores/slices/markdownsSlice';
import { ImageViewer } from './ImageViewer';

interface ViewMarkdownModalProps {
   isOpen: boolean;
   onClose: () => void;
   markdownId: string;
   onAddPhoto: () => void;
   onAddNote: () => void;
}

export const ViewMarkdownModal = ({
   isOpen,
   onClose,
   markdownId,
   onAddPhoto,
   onAddNote,
}: ViewMarkdownModalProps) => {
   const dispatch = useDispatch();
   const [markdown, setMarkdown] = useState<MarkdownResponse | null>(null);
   const [loadingImages, setLoadingImages] = useState<{
      [key: string]: boolean;
   }>({});
   const [selectedImage, setSelectedImage] = useState<{
      id: string;
      url: string;
   } | null>(null);
   const [selectedNote, setSelectedNote] = useState<number | null>(null);

   interface Note {
      id: string;
      text: string;
   }

   // Not içeriğinin ilk satırını ve karakter sayısını al
   const getNotePreview = (note: string) => {
      const firstLine = note.split('\n')[0];
      if (firstLine.length <= 100) return firstLine;
      return firstLine.substring(0, 97) + '...';
   };

   useEffect(() => {
      const fetchMarkdown = async () => {
         if (!isOpen || !markdownId) return;

         // Reset states when modal opens
         setMarkdown(null);
         setLoadingImages({});
         setSelectedNote(null);
         setSelectedImage(null);

         dispatch(setLoading(true));
         try {
            const response = await markdownAPI.getSingleMarkdown(markdownId);
            // Her fotoğraf için loading state'i true olarak ayarla
            const initialLoadingState = response.photos.reduce(
               (
                  acc: { [key: string]: boolean },
                  photo: { id: string; url: string }
               ) => {
                  acc[photo.url] = true;
                  return acc;
               },
               {}
            );
            setLoadingImages(initialLoadingState);
            setMarkdown(response);
         } catch (error) {
            console.error('Error fetching markdown:', error);
            dispatch(
               setError(
                  error instanceof Error
                     ? error.message
                     : 'Failed to fetch markdown details'
               )
            );
         } finally {
            dispatch(setLoading(false));
         }
      };

      fetchMarkdown();

      // Cleanup function
      return () => {
         setMarkdown(null);
         setLoadingImages({});
         setSelectedNote(null);
         setSelectedImage(null);
      };
   }, [isOpen, markdownId, dispatch]);

   if (!isOpen || !markdown) return null;

   return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[1000]">
         <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
               <div className="flex justify-between items-start">
                  <h2 className="text-xl font-medium text-gray-900">
                     {markdown.title}
                  </h2>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={onAddPhoto}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        title="Add Photo"
                     >
                        <svg
                           className="w-5 h-5"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4-4a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                           />
                        </svg>
                     </button>
                     <button
                        onClick={onAddNote}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                        title="Add Note"
                     >
                        <svg
                           className="w-5 h-5"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                           />
                        </svg>
                     </button>
                     <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                        title="Close"
                     >
                        <svg
                           className="w-5 h-5"
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
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
               {/* Photos Section */}
               {markdown.photos.length > 0 && (
                  <div className="mb-8">
                     <h3 className="text-sm font-medium text-gray-500 mb-4">
                        Photos
                     </h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {markdown.photos.map((photo, index) => (
                           <div
                              key={index}
                              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer group"
                              onClick={() => setSelectedImage(photo)}
                           >
                              {loadingImages[photo.url] && (
                                 <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600"></div>
                                 </div>
                              )}
                              <img
                                 src={photo.url}
                                 alt={`Photo ${index + 1}`}
                                 className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] ${
                                    loadingImages[photo.url]
                                       ? 'opacity-0'
                                       : 'opacity-100'
                                 }`}
                                 onLoad={() => {
                                    setLoadingImages((prev) => ({
                                       ...prev,
                                       [photo.url]: false,
                                    }));
                                 }}
                                 onError={() => {
                                    setLoadingImages((prev) => ({
                                       ...prev,
                                       [photo.url]: false,
                                    }));
                                 }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                       confirm(
                                          'Are you sure you want to delete this photo?'
                                       )
                                    ) {
                                       dispatch(setLoading(true));
                                       markdownAPI
                                          .deleteMarkdownPhoto(
                                             markdownId,
                                             photo.id
                                          )
                                          .then(() =>
                                             markdownAPI.getSingleMarkdown(
                                                markdownId
                                             )
                                          )
                                          .then((response) => {
                                             setMarkdown(response);
                                             dispatch(setLoading(false));
                                          })
                                          .catch((error) => {
                                             console.error(
                                                'Error deleting photo:',
                                                error
                                             );
                                             dispatch(
                                                setError(
                                                   error instanceof Error
                                                      ? error.message
                                                      : 'Failed to delete photo'
                                                )
                                             );
                                          });
                                    }
                                 }}
                                 className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-200"
                              >
                                 <svg
                                    className="w-4 h-4"
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
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Notes Section */}
               {markdown.notes.length > 0 && (
                  <div>
                     <h3 className="text-sm font-medium text-gray-500 mb-4">
                        Notes
                     </h3>
                     <div className="space-y-3">
                        {markdown.notes.map((note: Note, index) => (
                           <div
                              key={index}
                              onClick={() =>
                                 setSelectedNote(
                                    selectedNote === index ? null : index
                                 )
                              }
                              className={`p-4 bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer
                                 ${selectedNote === index ? 'ring-1 ring-gray-300' : 'hover:bg-gray-100'}`}
                           >
                              <div className="flex items-start justify-between gap-4">
                                 <p
                                    className={`text-gray-700 leading-relaxed flex-1 ${
                                       selectedNote === index
                                          ? 'whitespace-pre-wrap'
                                          : 'line-clamp-1'
                                    }`}
                                 >
                                    {selectedNote === index
                                       ? note.text
                                       : getNotePreview(note.text)}
                                 </p>
                                 <div className="flex items-center gap-2">
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          if (
                                             confirm(
                                                'Are you sure you want to delete this note?'
                                             )
                                          ) {
                                             dispatch(setLoading(true));
                                             markdownAPI
                                                .deleteMarkdownNote(
                                                   markdownId,
                                                   note.id
                                                )
                                                .then(() =>
                                                   markdownAPI.getSingleMarkdown(
                                                      markdownId
                                                   )
                                                )
                                                .then((response) => {
                                                   setMarkdown(response);
                                                   dispatch(setLoading(false));
                                                })
                                                .catch((error) => {
                                                   console.error(
                                                      'Error deleting note:',
                                                      error
                                                   );
                                                   dispatch(
                                                      setError(
                                                         error instanceof Error
                                                            ? error.message
                                                            : 'Failed to delete note'
                                                      )
                                                   );
                                                });
                                          }
                                       }}
                                       className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                                    >
                                       <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                       </svg>
                                    </button>
                                    <svg
                                       className={`w-5 h-5 text-gray-400 shrink-0 transform transition-transform duration-200 ${
                                          selectedNote === index
                                             ? 'rotate-180'
                                             : ''
                                       }`}
                                       fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24"
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                       />
                                    </svg>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Empty State */}
               {markdown.photos.length === 0 && markdown.notes.length === 0 && (
                  <div className="text-center py-12">
                     <p className="text-gray-500">
                        No photos or notes yet. Add some memories to this
                        location!
                     </p>
                  </div>
               )}
            </div>
         </div>

         {/* Image Viewer */}
         <ImageViewer
            isOpen={selectedImage !== null}
            onClose={() => setSelectedImage(null)}
            imageUrl={selectedImage?.url || ''}
            onNext={() => {
               if (!markdown || !selectedImage) return;
               const currentIndex = markdown.photos.indexOf(selectedImage);
               if (currentIndex < markdown.photos.length - 1) {
                  setSelectedImage(markdown.photos[currentIndex + 1]);
               }
            }}
            onPrev={() => {
               if (!markdown || !selectedImage) return;
               const currentIndex = markdown.photos.indexOf(selectedImage);
               if (currentIndex > 0) {
                  setSelectedImage(markdown.photos[currentIndex - 1]);
               }
            }}
            hasNext={Boolean(
               markdown &&
                  selectedImage &&
                  markdown.photos.indexOf(selectedImage) <
                     markdown.photos.length - 1
            )}
            hasPrev={Boolean(
               markdown &&
                  selectedImage &&
                  markdown.photos.indexOf(selectedImage) > 0
            )}
         />
      </div>
   );
};
