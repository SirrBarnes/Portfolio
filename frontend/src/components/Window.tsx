import { useState, useRef, useEffect } from "react";

type Props = {
  data: any;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  activeWindowId: string | null;
};

type ResizeDir =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;

export default function Window({
  data,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  activeWindowId,
}: Props) {
  const [pos, setPos] = useState({ x: data.x ?? 120, y: data.y ?? 120 });
  const [size, setSize] = useState({
    width: data.width ?? 1100,
    height: data.height ?? 850,
  }); const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<ResizeDir>(null);
  const isUnmaximizingRef = useRef(false);
  const [floatingFromMaximized, setFloatingFromMaximized] = useState(false);
  const posRef = useRef(pos);
  const [snapPreview, setSnapPreview] = useState<null | "left" | "right" | "top">(null);

  const offset = useRef({ x: 0, y: 0 });

  const sizeRatio = useRef({
    widthRatio: size.width / window.innerWidth,
    heightRatio: size.height / (window.innerHeight - 40),
  });

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);
  // const contentRef = useRef<HTMLDivElement>(null);

  const snapBackIntoView = (currentPos: { x: number; y: number }, currentSize: { width: number; height: number }) => {
    const desktopWidth = window.innerWidth;
    const desktopHeight = window.innerHeight - 40;

    let { x, y } = currentPos;

    const halfWidth = currentSize.width / 2;
    const halfHeight = currentSize.height / 2;

    // too far left — more than half the window is off the left edge
    if (x + halfWidth < 0) {
      x = 0;
    }

    // too far right — more than half the window is off the right edge
    if (x + halfWidth > desktopWidth) {
      x = desktopWidth - currentSize.width;
    }

    // too far up — more than half the window is above the desktop
    if (y + halfHeight < 0) {
      y = 0;
    }

    // too far down — more than half the window is below the desktop
    if (y + halfHeight > desktopHeight) {
      y = desktopHeight - currentSize.height;
    }

    return { x, y };
  };

  // useEffect(() => {
  //   if (!contentRef.current) return;

  // const observer = new ResizeObserver(([entry]) => {
  //   const { width } = entry.contentRect;
  // });

  //   observer.observe(contentRef.current);

  //   return () => observer.disconnect();
  // }, []);

  /* ========================= */
  /* DRAG START */
  /* ========================= */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;


    onFocus(data.id);

    setDragging(true);

    // Always store cursor position only (not window offset)
    if (data.maximized) {
      setFloatingFromMaximized(true);
    } else {
      offset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
    }
  };

  const resizeStart = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  /* ========================= */
  /* RESIZE START */
  /* ========================= */
  const startResize = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: size.width,
      height: size.height,
      x: pos.x,
      y: pos.y,
    };

    setResizing(dir);
  };

  /* ========================= */
  /* MOVE / RESIZE */
  /* ========================= */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dragging) {
        const cursorX = e.clientX;
        const cursorY = e.clientY;

        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight - 40;

        const safeX = Math.max(0, Math.min(cursorX, desktopWidth));
        const safeY = Math.max(0, Math.min(cursorY, desktopHeight));

        // 🚨 MAXIMIZED DRAG = NO OFFSET MATH
        if (data.maximized && floatingFromMaximized) {
          onMaximize(data.id); // restore once

          requestAnimationFrame(() => {
            setPos({
              x: safeX - size.width / 2,
              y: safeY - 20,
            });
          });

          setFloatingFromMaximized(false);
          return;
        }

        // NORMAL WINDOW DRAG
        setPos({
          x: safeX - offset.current.x,
          y: safeY - offset.current.y,
        });
      }

      if (resizing) {
        // 🚨 stop if mouse released outside window
        if (e.buttons !== 1) {
          setResizing(null);
          return;
        }

        const dx = e.clientX - resizeStart.current.mouseX;
        const dy = e.clientY - resizeStart.current.mouseY;

        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight - 40;

        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;

        let newX = resizeStart.current.x;
        let newY = resizeStart.current.y;

        if (resizing.includes("right")) {
          newWidth = resizeStart.current.width + dx;
        }

        if (resizing.includes("bottom")) {
          newHeight = resizeStart.current.height + dy;
        }

        if (resizing.includes("left")) {
          newWidth = resizeStart.current.width - dx;
          newX = resizeStart.current.x + dx;
        }

        if (resizing.includes("top")) {
          newHeight = resizeStart.current.height - dy;
          newY = resizeStart.current.y + dy;
        }

        // constraints
        newWidth = Math.max(
          200,
          Math.min(newWidth, desktopWidth - newX)
        );

        newHeight = Math.max(
          150,
          Math.min(newHeight, desktopHeight - newY)
        );

        setPos({
          x: Math.max(0, newX),
          y: Math.max(0, newY),
        });

        setSize({
          width: newWidth,
          height: newHeight,
        });

        sizeRatio.current = {
          widthRatio: newWidth / window.innerWidth,
          heightRatio: newHeight / (window.innerHeight - 40),
        };
      }
    };

    const up = () => {
      if (dragging) {
        const snapped = snapBackIntoView(posRef.current, size);
        if (snapped.x !== posRef.current.x || snapped.y !== posRef.current.y) {
          setPos(snapped);
        }
      }
      setDragging(false);
      setResizing(null);
      setSnapPreview(null);
      isUnmaximizingRef.current = false;
    };


    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [dragging, resizing, snapPreview, data.maximized]);

  const style = data.maximized
    ? {
      top: 0,
      left: 0,
      width: "100%",
      height: "calc(100% - 40px)",
    }
    : {
      top: pos.y,
      left: pos.x,
      width: size.width,
      height: size.height,
    };

  useEffect(() => {
    const handleResize = () => {
      if (data.maximized) return;

      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - 40;

      setSize(() => {
        const scaledWidth = Math.max(300, Math.round(sizeRatio.current.widthRatio * desktopWidth));
        const scaledHeight = Math.max(200, Math.round(sizeRatio.current.heightRatio * desktopHeight));
        return { width: scaledWidth, height: scaledHeight };
      });

      setPos((prevPos) => {
        const clampedX = Math.min(prevPos.x, desktopWidth - 100);
        const clampedY = Math.min(prevPos.y, desktopHeight - 100);
        return {
          x: Math.max(0, clampedX),
          y: Math.max(0, clampedY),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data.maximized]);

  return (
    <>
      {/* SNAP PREVIEW OVERLAY */}
      {snapPreview && (
        <div
          className="snap-preview"
          style={{
            left:
              snapPreview === "right"
                ? "50%"
                : snapPreview === "left"
                  ? "0"
                  : "0",
            width:
              snapPreview === "top"
                ? "100%"
                : "50%",
            height:
              snapPreview === "top"
                ? "calc(100% - 40px)"
                : "calc(100% - 40px)",
          }}
        />
      )}

      <div
        className={`window 
          ${activeWindowId === data.id ? "active" : ""}
          ${data.isMinimizing ? "minimizing" : ""} 
          ${data.id === activeWindowId ? "active" : ""}
          ${dragging ? "dragging" : ""}
        `}
        style={{ ...style, zIndex: data.zIndex }}
        onMouseDown={() => onFocus(data.id)}
      >
        <div className="window-title" onMouseDown={handleMouseDown}>
          <span>{data.type}</span>

          <div>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onMinimize(data.id) }}>
              🗕
            </button>

            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onMaximize(data.id) }}>
              🗖
            </button>

            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onClose(data.id) }}>
              ✖
            </button>

          </div>
        </div>

        <div className="window-content">
          {data.type === "Resume" ? (
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {children}
            </div>
          ) : (
            <div
              className="window-inner"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: 'hidden',
              }}
            >
              <div className="page">
                {children}
              </div>
            </div>
          )}
        </div>

        {/* RESIZE HANDLES */}
        <div className="resize-handle right" onMouseDown={startResize("right")} />
        <div className="resize-handle bottom" onMouseDown={startResize("bottom")} />
        <div className="resize-handle corner" onMouseDown={startResize("bottom-right")} />
      </div >
    </>
  );
}