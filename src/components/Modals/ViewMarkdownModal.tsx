import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { markdownAPI } from '../../services/markdownApi';
import type { MarkdownResponse } from '../../types';
import { setError, setLoading } from '../../stores/slices/markdownsSlice';
import { ImageViewer } from './ImageViewer';
import { ConfirmModal } from './ConfirmModal';

interface ViewMarkdownModalProps {
   isOpen: boolean;
   onClose: () => void;
   markdownId: string;
   onDelete?: () => void;
}

export const ViewMarkdownModal = ({
   isOpen,
   onClose,
   markdownId,
   onDelete,
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
   const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
   const [editNoteText, setEditNoteText] = useState<string>('');
   const [updatingNote, setUpdatingNote] = useState<boolean>(false);
   const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState<
      string | null
   >(null);
   const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<
      string | null
   >(null);
   const [isUploadingPhotos, setIsUploadingPhotos] = useState<boolean>(false);
   const prevSelectedNoteRef = useRef<number | null>(null);
   const [confirmDeleteMarkdown, setConfirmDeleteMarkdown] =
      useState<boolean>(false);

   const [showAddNote, setShowAddNote] = useState<boolean>(false);
   const [noteText, setNoteText] = useState<string>('');
   const [savingNote, setSavingNote] = useState<boolean>(false);
   const [openMoreActions, setOpenMoreActions] = useState<boolean>(false);
   const moreMenuRef = useRef<HTMLDivElement | null>(null);
   const [isDeletingMarkdown, setIsDeletingMarkdown] = useState<boolean>(false);
   const [uploadNotice, setUploadNotice] = useState<string | null>(null);
   const MAX_FILES_PER_UPLOAD = 10;

   interface Note {
      id: string;
      text: string;
   }

   const getNotePreview = (note: string) => {
      const firstLine = note.split('\n')[0];
      if (firstLine.length <= 100) return firstLine;
      return firstLine.substring(0, 97) + '...';
   };

   useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            onClose();
         }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
   }, [isOpen, onClose]);

   // Blur and disable the map header while modal is open
   useEffect(() => {
      const header = document.querySelector('header') as HTMLElement | null;
      if (!header) return;
      if (isOpen) {
         header.style.pointerEvents = 'none';
         header.style.filter = 'blur(3px)';
         header.style.opacity = '0.6';
         header.setAttribute('aria-hidden', 'true');
      } else {
         header.style.pointerEvents = '';
         header.style.filter = '';
         header.style.opacity = '';
         header.removeAttribute('aria-hidden');
      }
      return () => {
         if (!header) return;
         header.style.pointerEvents = '';
         header.style.filter = '';
         header.style.opacity = '';
         header.removeAttribute('aria-hidden');
      };
   }, [isOpen]);

   useEffect(() => {
      if (!openMoreActions) return;
      const handleOutside = (e: MouseEvent) => {
         if (
            moreMenuRef.current &&
            !moreMenuRef.current.contains(e.target as Node)
         ) {
            setOpenMoreActions(false);
         }
      };
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
   }, [openMoreActions]);

   useEffect(() => {
      if (
         !isOpen ||
         selectedImage ||
         confirmDeleteNoteId ||
         confirmDeletePhotoId ||
         showAddNote
      ) {
         setOpenMoreActions(false);
      }
   }, [
      isOpen,
      selectedImage,
      confirmDeleteNoteId,
      confirmDeletePhotoId,
      showAddNote,
   ]);

   useEffect(() => {
      const fetchMarkdown = async () => {
         if (!isOpen || !markdownId) return;

         setMarkdown(null);
         setLoadingImages({});
         setSelectedNote(null);
         setSelectedImage(null);

         dispatch(setLoading(true));
         try {
            const response = await markdownAPI.getSingleMarkdown(markdownId);
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

   const refreshMarkdown = async () => {
      try {
         const response = await markdownAPI.getSingleMarkdown(markdownId);
         setMarkdown(response);
      } catch (error) {
         dispatch(
            setError(
               error instanceof Error
                  ? error.message
                  : 'Failed to refresh markdown'
            )
         );
      }
   };

   const handleUpdateNote = async (noteId: string) => {
      if (!editNoteText.trim()) return;
      setUpdatingNote(true);
      dispatch(setLoading(true));
      try {
         await markdownAPI.updateMarkdownNote(noteId, {
            markdownId,
            text: editNoteText.slice(0, 1500),
         });
         setMarkdown((prev) => {
            if (!prev) return prev;
            return {
               ...prev,
               notes: prev.notes.map((n) =>
                  n.id === noteId ? { ...n, text: editNoteText } : n
               ),
            };
         });
         setEditingNoteId(null);
         setEditNoteText('');
      } catch (error) {
         // interceptor toasts
      } finally {
         setUpdatingNote(false);
         dispatch(setLoading(false));
      }
   };

   const uploadFiles = async (filesToUpload: File[]) => {
      if (!filesToUpload.length) return;
      let files = filesToUpload;
      if (filesToUpload.length > MAX_FILES_PER_UPLOAD) {
         files = filesToUpload.slice(0, MAX_FILES_PER_UPLOAD);
         setUploadNotice(
            `You can upload up to ${MAX_FILES_PER_UPLOAD} photos at a time. Only the first ${MAX_FILES_PER_UPLOAD} will be uploaded.`
         );
         setTimeout(() => setUploadNotice(null), 3500);
      }
      setIsUploadingPhotos(true);
      dispatch(setLoading(true));
      try {
         await markdownAPI.uploadMarkdownPhotos(markdownId, files);
         await refreshMarkdown();
      } catch (error) {
      } finally {
         dispatch(setLoading(false));
         setIsUploadingPhotos(false);
      }
   };

   const handleAddNote = async () => {
      if (!noteText.trim()) return;
      setSavingNote(true);
      dispatch(setLoading(true));
      try {
         await markdownAPI.createMarkdownNote({
            markdownId,
            text: noteText.slice(0, 1500),
         });
         await refreshMarkdown();
         setNoteText('');
         setShowAddNote(false);
      } catch (error) {
      } finally {
         setSavingNote(false);
         dispatch(setLoading(false));
      }
   };

   if (!isOpen) return null;

   if (!markdown) {
      return (
         <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[1000]">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-8 flex items-center justify-center">
               <div className="flex items-center gap-3 text-gray-600">
                  <span className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  <span className="text-sm">Loading memory...</span>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[1000]">
         <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            {isDeletingMarkdown && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
                  <div className="flex items-center gap-3 text-gray-700">
                     <span className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                     <span className="text-sm">Deleting memory...</span>
                  </div>
               </div>
            )}
            {/* Close button (floating) */}
            <button
               onClick={onClose}
               className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20 pointer-events-auto"
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

            {/* Content */}
            <div className="px-6 py-5">
               {/* Title with compact More menu */}
               <div className="mb-6 flex items-center gap-2 relative">
                  <h2 className="text-lg font-semibold text-gray-900">
                     Memory
                  </h2>
                  <div className="relative" ref={moreMenuRef}>
                     <button
                        onClick={() => setOpenMoreActions((v) => !v)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        aria-label="More actions"
                     >
                        <svg
                           className="w-4 h-4"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                        >
                           <circle cx="5" cy="12" r="1.5" />
                           <circle cx="12" cy="12" r="1.5" />
                           <circle cx="19" cy="12" r="1.5" />
                        </svg>
                     </button>
                     {openMoreActions && (
                        <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-sm z-10">
                           <button
                              onClick={() => {
                                 setOpenMoreActions(false);
                                 setConfirmDeleteMarkdown(true);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                           >
                              Delete Memory
                           </button>
                        </div>
                     )}
                  </div>
               </div>
               {/* Inline Add Photo (removed in favor of grid upload tile) */}

               {/* Note composer rendered only within the Notes section below */}
               {/* Photos Section */}
               {markdown.photos.length > 0 && (
                  <div className="mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">
                           Photos
                        </h3>
                        <span className="text-xs text-gray-400">
                           Max 10 photos per upload
                        </span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Uploading overlay over grid */}
                        {isUploadingPhotos && (
                           <div className="col-span-2 md:col-span-3">
                              <div className="w-full h-24 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
                                 <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <svg
                                       className="animate-spin h-5 w-5 text-gray-400"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       stroke="currentColor"
                                    >
                                       <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          strokeWidth="4"
                                       ></circle>
                                       <path
                                          className="opacity-75"
                                          d="M4 12a8 8 0 018-8"
                                          strokeWidth="4"
                                       ></path>
                                    </svg>
                                    Uploading photos...
                                 </div>
                              </div>
                           </div>
                        )}
                        {/* Upload tile always visible */}
                        <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#9E7B9B] transition-colors">
                           <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                 const selected = Array.from(
                                    e.target.files || []
                                 );
                                 uploadFiles(selected);
                              }}
                           />
                           <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-500">
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
                                    d="M12 4v16m8-8H4"
                                 />
                              </svg>
                           </div>
                        </label>

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
                                    setConfirmDeletePhotoId(photo.id);
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

               {/* Photos Empty State - keep photos area above notes even when empty */}
               {markdown.photos.length === 0 && (
                  <div className="mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">
                           Photos
                        </h3>
                        <span className="text-xs text-gray-400">
                           Max 10 photos per upload
                        </span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {isUploadingPhotos && (
                           <div className="col-span-2 md:col-span-3">
                              <div className="w-full h-24 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
                                 <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <svg
                                       className="animate-spin h-5 w-5 text-gray-400"
                                       viewBox="0 0 24 24"
                                       fill="none"
                                       stroke="currentColor"
                                    >
                                       <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          strokeWidth="4"
                                       ></circle>
                                       <path
                                          className="opacity-75"
                                          d="M4 12a8 8 0 018-8"
                                          strokeWidth="4"
                                       ></path>
                                    </svg>
                                    Uploading photos...
                                 </div>
                              </div>
                           </div>
                        )}
                        {/* Empty photo tile - label triggers input */}
                        <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-[#9E7B9B] transition-colors">
                           <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                 const selected = Array.from(
                                    e.target.files || []
                                 );
                                 uploadFiles(selected);
                              }}
                           />
                           <div
                              className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-[#9E7B9B] hover:shadow-md transition"
                              title="Add Photos"
                           >
                              <svg
                                 className="w-6 h-6"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                 />
                              </svg>
                           </div>
                        </label>
                     </div>
                  </div>
               )}

               {/* Notes Section with add tile at top */}
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-medium text-gray-500">
                        Notes
                     </h3>
                     {uploadNotice && (
                        <div className="px-6 pb-4 -mt-2">
                           <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
                              {uploadNotice}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Add Note tile / composer at top */}
                  {showAddNote ? (
                     <div className="mb-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                           <h4 className="text-sm font-medium text-gray-700">
                              Add Note
                           </h4>
                           <button
                              className="text-xs text-gray-500 hover:text-gray-700"
                              onClick={() => setShowAddNote(false)}
                           >
                              Cancel
                           </button>
                        </div>
                        <textarea
                           value={noteText}
                           onChange={(e) => setNoteText(e.target.value)}
                           placeholder="Write your memory here..."
                           className={`w-full min-h-28 p-3 border rounded-md focus:ring-2 focus:border-transparent ${
                              noteText.length >= 1500
                                 ? 'border-red-300 focus:ring-red-500'
                                 : 'border-gray-200 focus:ring-[#9E7B9B]'
                           }`}
                           maxLength={1500}
                        />
                        <div
                           className={`mt-1 text-xs text-right ${
                              noteText.length >= 1500
                                 ? 'text-red-600'
                                 : 'text-gray-400'
                           }`}
                        >
                           {noteText.length}/1500
                        </div>
                        <div className="flex justify-end mt-3">
                           <button
                              onClick={handleAddNote}
                              disabled={savingNote || !noteText.trim()}
                              className={`px-4 py-2 rounded-md text-white ${savingNote || !noteText.trim() ? 'bg-[#9E7B9B]/60 cursor-not-allowed' : 'bg-[#9E7B9B] hover:bg-[#8B6B8B]'}`}
                           >
                              {savingNote ? 'Saving...' : 'Save Note'}
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div
                        className="mb-3 relative p-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#9E7B9B]"
                        onClick={() => setShowAddNote(true)}
                     >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white shadow text-gray-600 hover:text-[#2D3748] hover:shadow-md transition">
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
                                 d="M12 4v16m8-8H4"
                              />
                           </svg>
                           <span className="text-sm font-medium">Add Note</span>
                        </div>
                     </div>
                  )}

                  {markdown.notes.length > 0 && (
                     <div className="space-y-3">
                        {markdown.notes.map((note: Note, index) => (
                           <div
                              key={index}
                              onClick={() =>
                                 setSelectedNote(
                                    selectedNote === index ? null : index
                                 )
                              }
                              className={`p-4 bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer ${selectedNote === index ? 'ring-1 ring-gray-300' : 'hover:bg-gray-100'}`}
                           >
                              <div className="flex items-start justify-between gap-4">
                                 <div className="flex-1">
                                    {editingNoteId === note.id ? (
                                       <div>
                                          <textarea
                                             className={`w-full min-h-28 p-3 border rounded-md focus:ring-2 focus:border-transparent ${
                                                editNoteText.length >= 1500
                                                   ? 'border-red-300 focus:ring-red-500'
                                                   : 'border-gray-200 focus:ring-[#9E7B9B]'
                                             }`}
                                             value={editNoteText}
                                             onChange={(e) =>
                                                setEditNoteText(e.target.value)
                                             }
                                             onClick={(e) =>
                                                e.stopPropagation()
                                             }
                                             maxLength={1500}
                                          />
                                          <div
                                             className={`mt-1 text-xs text-right ${
                                                editNoteText.length >= 1500
                                                   ? 'text-red-600'
                                                   : 'text-gray-400'
                                             }`}
                                          >
                                             {editNoteText.length}/1500
                                          </div>
                                          <div className="mt-2 flex gap-2 justify-end">
                                             <button
                                                className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   setEditingNoteId(null);
                                                   setEditNoteText('');
                                                }}
                                             >
                                                Cancel
                                             </button>
                                             <button
                                                className={`px-3 py-1.5 rounded-md text-sm text-white ${!editNoteText.trim() || updatingNote ? 'bg-[#9E7B9B]/60 cursor-not-allowed' : 'bg-[#9E7B9B] hover:bg-[#8B6B8B]'}`}
                                                disabled={
                                                   !editNoteText.trim() ||
                                                   updatingNote
                                                }
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   handleUpdateNote(note.id);
                                                }}
                                             >
                                                {updatingNote
                                                   ? 'Saving...'
                                                   : 'Save'}
                                             </button>
                                          </div>
                                       </div>
                                    ) : (
                                       <p
                                          className={`text-gray-700 leading-relaxed ${selectedNote === index ? 'whitespace-pre-wrap' : 'line-clamp-1'}`}
                                       >
                                          {selectedNote === index
                                             ? note.text
                                             : getNotePreview(note.text)}
                                       </p>
                                    )}
                                 </div>
                                 {editingNoteId !== note.id && (
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             setEditingNoteId(note.id);
                                             setEditNoteText(note.text);
                                             setSelectedNote(index);
                                          }}
                                          className="p-1 rounded-full text-gray-400 hover:text-[#9E7B9B] hover:bg-gray-50 transition-all duration-200 cursor-pointer"
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
                                                d="M11 5h2m-5.5 12.5L5 19l1.5-3.5L16 6l3 3-9.5 9.5z"
                                             />
                                          </svg>
                                       </button>
                                       <button
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             prevSelectedNoteRef.current =
                                                selectedNote;
                                             setConfirmDeleteNoteId(note.id);
                                          }}
                                          className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
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
                                          className={`w-5 h-5 text-gray-400 shrink-0 transform transition-transform duration-200 ${selectedNote === index ? 'rotate-180' : ''}`}
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
                                 )}

                                 {/* Confirm modal rendered once below */}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Empty Notes handled by the Notes section add tile above */}

               {/* Footer actions removed; delete moved to More menu near title */}
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

         {/* Confirm delete photo */}
         <ConfirmModal
            isOpen={confirmDeletePhotoId !== null}
            title="Delete photo?"
            description="This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
               if (!confirmDeletePhotoId) return;
               dispatch(setLoading(true));
               markdownAPI
                  .deleteMarkdownPhoto(markdownId, confirmDeletePhotoId)
                  .then(() => markdownAPI.getSingleMarkdown(markdownId))
                  .then((response) => {
                     setMarkdown(response);
                     dispatch(setLoading(false));
                     setConfirmDeletePhotoId(null);
                  })
                  .catch((error) => {
                     console.error('Error deleting photo:', error);
                     dispatch(
                        setError(
                           error instanceof Error
                              ? error.message
                              : 'Failed to delete photo'
                        )
                     );
                     setConfirmDeletePhotoId(null);
                  });
            }}
            onCancel={() => setConfirmDeletePhotoId(null)}
         />

         {/* Confirm delete note (single instance) */}
         <ConfirmModal
            isOpen={confirmDeleteNoteId !== null}
            title="Delete note?"
            description="This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
               if (!confirmDeleteNoteId) return;
               dispatch(setLoading(true));
               markdownAPI
                  .deleteMarkdownNote(markdownId, confirmDeleteNoteId)
                  .then(() => markdownAPI.getSingleMarkdown(markdownId))
                  .then((response) => {
                     setMarkdown(response);
                     dispatch(setLoading(false));
                     setSelectedNote(null);
                     setConfirmDeleteNoteId(null);
                  })
                  .catch((error) => {
                     console.error('Error deleting note:', error);
                     dispatch(
                        setError(
                           error instanceof Error
                              ? error.message
                              : 'Failed to delete note'
                        )
                     );
                     setConfirmDeleteNoteId(null);
                  });
            }}
            onCancel={() => {
               setConfirmDeleteNoteId(null);
               // Restore previous selected note to avoid unintended expansion
               // If none, keep current state
            }}
         />

         {/* Confirm delete markdown */}
         <ConfirmModal
            isOpen={confirmDeleteMarkdown}
            title="Delete this memory?"
            description="All photos and notes will be removed. This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
               setIsDeletingMarkdown(true);
               dispatch(setLoading(true));
               markdownAPI
                  .deleteMarkdown(markdownId)
                  .then(() => {
                     dispatch(setLoading(false));
                     setConfirmDeleteMarkdown(false);
                     onClose();
                     onDelete?.();
                  })
                  .catch((error) => {
                     console.error('Error deleting markdown:', error);
                     dispatch(
                        setError(
                           error instanceof Error
                              ? error.message
                              : 'Failed to delete memory'
                        )
                     );
                     setConfirmDeleteMarkdown(false);
                  })
                  .finally(() => {
                     setIsDeletingMarkdown(false);
                  });
            }}
            onCancel={() => setConfirmDeleteMarkdown(false)}
         />
      </div>
   );
};
