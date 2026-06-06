/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  useMagicCursor — companion hook for MagicWandCursor         ║
 * ║                                                              ║
 * ║  Exposes cursor state so other components can react to it:   ║
 * ║    • isHovering  – cursor is over an interactive element     ║
 * ║    • isClicking  – mouse button is held down                 ║
 * ║    • position    – { x, y } in viewport px                   ║
 * ║                                                              ║
 * ║  Usage:                                                      ║
 * ║    const { isHovering, setIsHovering } = useMagicCursor()    ║
 * ║    <div onMouseEnter={() => setIsHovering(true)}             ║
 * ║          onMouseLeave={() => setIsHovering(false)}>          ║
 * ║      Hover me                                                ║
 * ║    </div>                                                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────
interface CursorState {
  position     : { x: number; y: number };
  isHovering   : boolean;
  isClicking   : boolean;
  setIsHovering: (v: boolean) => void;
}

const CursorContext = createContext<CursorState>({
  position     : { x: -200, y: -200 },
  isHovering   : false,
  isClicking   : false,
  setIsHovering: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function MagicCursorProvider({ children }: { children: ReactNode }) {
  const [position,   setPosition]   = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const onMove  = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const onDown  = () => setIsClicking(true);
    const onUp    = () => setIsClicking(false);

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
    };
  }, []);

  return (
    <CursorContext.Provider value={{ position, isHovering, isClicking, setIsHovering }}>
      {children}
    </CursorContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useMagicCursor() {
  return useContext(CursorContext);
}

// ─── Hover binding helper ─────────────────────────────────────────────────────
/**
 * Attach to any element to make the wand "activate" on hover.
 * Returns { ref, handlers } — spread handlers onto the target element.
 *
 * @example
 * const { ref, handlers } = useWandHover();
 * <button ref={ref} {...handlers}>Click me</button>
 */
export function useWandHover() {
  const { setIsHovering } = useMagicCursor();
  const ref = useRef<HTMLElement>(null);

  const handlers = {
    onMouseEnter: useCallback(() => setIsHovering(true),  [setIsHovering]),
    onMouseLeave: useCallback(() => setIsHovering(false), [setIsHovering]),
  };

  return { ref, handlers };
}

/*
 * ═══════════════════════════════════════════════════════════════════
 *  INTEGRATION GUIDE
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. In app/layout.tsx (Next.js App Router):
 *
 *     import MagicWandCursor     from '@/components/MagicWandCursor'
 *     import { MagicCursorProvider } from '@/components/useMagicCursor'
 *
 *     export default function RootLayout({ children }) {
 *       return (
 *         <html lang="en">
 *           <body className="cursor-none">
 *             <MagicCursorProvider>
 *               <MagicWandCursor />
 *               {children}
 *             </MagicCursorProvider>
 *           </body>
 *         </html>
 *       )
 *     }
 *
 *  2. To disable on specific elements (restore system cursor):
 *
 *     <div className="cursor-auto">
 *       Normal cursor here
 *     </div>
 *
 *  3. To trigger extra sparkle burst from code:
 *
 *     // Dispatch a synthetic click on the canvas coordinates
 *     document.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y }))
 *
 *  4. Customize spawn rate / particle count:
 *     Open MagicWandCursor.tsx and adjust:
 *       const spawnRate = Math.max(16, 60 - speed * 1.5)  ← lower = more particles
 *       const count = speed > 10 ? 3 : 1                   ← increase for denser trail
 *
 *  5. Customize palette:
 *     Change PALETTE object at top of MagicWandCursor.tsx.
 *     All Three.js and 2D canvas colors derive from it.
 * ═══════════════════════════════════════════════════════════════════
 */