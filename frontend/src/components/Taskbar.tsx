import { useState, useEffect } from "react";
import StartMenu from "./StartMenu";
import Windows11ClockPanel from "./ClockPanel";
import useClock from "./Clock";

type Props = {
  windows: any[];
  onRestore: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onClose: (id: string) => void;
  onCloseAll: () => void;
  activeWindowId: string | null;
  onOpenApp: (type: any) => void;
};

export default function Taskbar({
  windows,
  onRestore,
  onMinimize,
  onMaximize,
  onOpenApp,
  activeWindowId,
  onClose,
  onCloseAll,
}: Props) {
  const [open, setOpen] = useState(false);
  const [clockOpen, setClockOpen] = useState(false);
  const { now, timeZone } = useClock();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: "window" | "taskbar";
    windowId?: string;
  } | null>(null);

  const taskbarTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(now);

  const taskbarDate = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    timeZone,
  }).format(now);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const getWindow = () =>
    windows.find((w) => w.id === contextMenu?.windowId);

  return (
    <>
      <div
        className="taskbar"
        onContextMenu={(e) => {
          e.preventDefault();

          if ((e.target as HTMLElement).closest("button")) return;

          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            type: "taskbar",
          });
        }}
      >
        {/* START */}
        <div className="taskbar-left">
          <button
            className={`start ${open ? "active-start" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <span className="start-logo" />
            Start
          </button>

          {open && (
            <StartMenu
              open={open}
              onClose={() => setOpen(false)}
              onOpenApp={(type) => {
                onOpenApp(type);
                setOpen(false);
              }}
            />
          )}
        </div>

        {/* WINDOWS */}
        <div className="taskbar-center">
          {windows.map((w: any) => (
            <button
              key={w.id}
              onClick={() => {
                if (w.id === activeWindowId) {
                  onMinimize(w.id);
                } else {
                  onRestore(w.id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  type: "window",
                  windowId: w.id,
                });
              }}
              className={w.id === activeWindowId ? "active-task" : ""}
            >
              {w.type}
            </button>
          ))}
        </div>

        {/* CLOCK */}
        <div className="taskbar-right">
          <div className={`clock ${clockOpen ? "active-clock" : ""}`} onClick={() => setClockOpen(prev => !prev)}>
            <div className = 'taskbar-time'>{taskbarTime}</div>
            <div className = 'taskbar-date'>{taskbarDate}</div>
          </div>
        </div>
      </div>

      {/* 🔥 CONTEXT MENU */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === "window" && (() => {
            const w = getWindow();

            if (!w) return null;

            return (
              <>
                <div
                  className={`context-item ${w.minimized ? "" : "disabled"}`}
                  onClick={() => {
                    onRestore(w.id);
                    setContextMenu(null);
                  }}
                >
                  Restore
                </div>

                <div
                  className={`context-item ${!w.minimized ? "" : "disabled"}`}
                  onClick={() => {
                    onMinimize(w.id);
                    setContextMenu(null);
                  }}
                >
                  Minimize
                </div>

                <div
                  className={`context-item ${!w.maximized ? "" : "disabled"}`}
                  onClick={() => {
                    onMaximize(w.id);
                    setContextMenu(null);
                  }}
                >
                  Maximize
                </div>

                <div className="context-separator" />

                <div
                  className="context-item"
                  onClick={() => {
                    onClose(w.id);
                    setContextMenu(null);
                  }}
                >
                  Close
                </div>
              </>
            );
          })()}

          {contextMenu.type === "taskbar" && (
            <div
              className={`context-item ${windows.length != 0 ? "" : "disabled"}`}
              onClick={() => {
                if (windows.length === 0) return;

                onCloseAll();
                setContextMenu(null);
              }}
            >
              Close All Windows
            </div>
          )}
        </div>
      )}

      <Windows11ClockPanel
        open={clockOpen}
        onClose={() => setClockOpen(false)}
      />
    </>
  );
}