import { useEffect, useState } from 'react';
import { useCursor } from '../../contexts/CursorContext';
import { IconMapPin } from '../Icons/MapPin';

interface MousePosition {
   x: number;
   y: number;
}

export const CustomCursor = () => {
   const { cursorType } = useCursor();
   const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
   const [visible, setVisible] = useState<boolean>(false);

   useEffect(() => {
      if (cursorType !== 'location') {
         setVisible(false);
         return;
      }

      const handleMove = (e: MouseEvent) => {
         // Hide on elements that block custom cursor (e.g., map header, dropdowns, inputs)
         let isBlocked = false;
         let el: HTMLElement | null = e.target as HTMLElement | null;
         while (el) {
            if (el.dataset && el.dataset.cursorBlock === 'true') {
               isBlocked = true;
               break;
            }
            el = el.parentElement;
         }

         if (isBlocked) {
            setVisible(false);
            return;
         }

         setPosition({ x: e.clientX, y: e.clientY });
         setVisible(true);
      };
      const handleLeave = () => setVisible(false);

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseleave', handleLeave);

      return () => {
         window.removeEventListener('mousemove', handleMove);
         window.removeEventListener('mouseleave', handleLeave);
      };
   }, [cursorType]);

   // Only show inside the map scope
   const isOverMap = (() => {
      const el = document.elementFromPoint(
         position.x,
         position.y
      ) as HTMLElement | null;
      let node: HTMLElement | null = el;
      while (node) {
         if (node.dataset && node.dataset.cursorScope === 'map') return true;
         node = node.parentElement;
      }
      return false;
   })();

   if (cursorType !== 'location' || !visible || !isOverMap) return null;

   // Offset so that the pin tip aligns with the actual pointer
   const offsetX = 12;
   const offsetY = 24;

   return (
      <div
         style={{
            position: 'fixed',
            left: `${position.x - offsetX}px`,
            top: `${position.y - offsetY}px`,
            pointerEvents: 'none',
            zIndex: 9999,
         }}
      >
         <IconMapPin
            className="w-6 h-6"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth={1.5}
         />
      </div>
   );
};
