import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import Projects from "../pages/Projects";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Resume from "../pages/Resume";
import Gallery from "../pages/Gallery";
import Terminal from "../pages/Terminal";
import Minesweeper from './minesweeper/Minesweeper';

import resume from '../icons/txt.png';
import contact from '../icons/contact.png';
import terminal from '../icons/terminal.png';
import about from '../icons/about.png';
import gallery from '../icons/gallery.png';
import projects from '../icons/computer.png';
// import minesweep from '../icons/minesweep.png';

type WindowType = "Projects" | "About" | "Terminal" | "Contact" | "Resume" | "Gallery" | "Minesweeper" | "ImageViewer";

type WindowData = {
    id: string;
    type: WindowType;
    minimized: boolean;
    maximized: boolean;
    zIndex: number;
    isMinimizing?: boolean;
    x?: number;
    y?: number;
    payload?: { imageSrc: string; imageName: string };
    width?: number;
    height?: number;
};


export default function Desktop() {
    const [windows, setWindows] = useState<WindowData[]>([]);
    const [, setZCounter] = useState(1);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [cascadeOffset, setCascadeOffset] = useState(0);
    const ICON_WIDTH = 120;
    const ICON_MIN_SPACING_Y = 60;
    const ICON_MAX_SPACING_Y = 105;
    const ICON_START_X = 20;
    const ICON_START_Y = 20;
    const TASKBAR_HEIGHT = 40;
    const ICON_LABELS = ["Projects", "Resume", "Gallery", "Terminal", "Contact", "About"];

    const [iconSpacing, setIconSpacing] = useState(ICON_MAX_SPACING_Y);
    const [iconsPerColumn, setIconsPerColumn] = useState(ICON_LABELS.length);

    useEffect(() => {
        const calculateLayout = () => {
            const availableHeight = window.innerHeight - TASKBAR_HEIGHT - ICON_START_Y * 2;
            const totalIcons = ICON_LABELS.length;

            // how much vertical space each icon would need at max spacing
            const neededHeight = totalIcons * ICON_MAX_SPACING_Y;

            if (neededHeight <= availableHeight) {
                // everything fits at full spacing, no need to shrink or wrap
                setIconSpacing(ICON_MAX_SPACING_Y);
                setIconsPerColumn(totalIcons);
                return;
            }

            // try shrinking spacing down to the floor before wrapping to a new column
            const fittedSpacing = Math.max(
                ICON_MIN_SPACING_Y,
                Math.floor(availableHeight / totalIcons)
            );

            if (fittedSpacing >= ICON_MIN_SPACING_Y && totalIcons * fittedSpacing <= availableHeight) {
                setIconSpacing(fittedSpacing);
                setIconsPerColumn(totalIcons);
            } else {
                // even at minimum spacing it doesn't fit — wrap into multiple columns
                const maxPerColumn = Math.max(1, Math.floor(availableHeight / ICON_MIN_SPACING_Y));
                setIconSpacing(ICON_MIN_SPACING_Y);
                setIconsPerColumn(maxPerColumn);
            }
        };

        calculateLayout();
        window.addEventListener("resize", calculateLayout);
        return () => window.removeEventListener("resize", calculateLayout);
    }, []);

    const windowsLayerRef = useRef<HTMLDivElement>(null);
    const [, setContextMenu] = useState<{
        x: Number;
        y: Number;
        type: "icon" | "task" | "taskbar";
        payload?: any;
    } | null>(null);

    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    useEffect(() => {
        if (windowsLayerRef.current) {
            windowsLayerRef.current.scrollTop = 0;
            windowsLayerRef.current.scrollLeft = 0;
        }
    }, [windows]);

    const openImageWindow = (imageSrc: string, imageName: string) => {
        setZCounter((prevZ) => {
            const newZ = prevZ + 1;

            setWindows((prev) => {
                // 🔥 check for an existing window showing this same image
                const existing = prev.find(
                    (w) => w.type === "ImageViewer" && w.payload?.imageSrc === imageSrc
                );

                if (existing) {
                    setActiveWindowId(existing.id);

                    return prev.map((w) =>
                        w.id === existing.id
                            ? { ...w, minimized: false, zIndex: newZ }
                            : w
                    );
                }

                // 🔥 create new instance only if none exists
                const id = crypto.randomUUID();
                const offset = cascadeOffset * 30;

                setActiveWindowId(id);
                setCascadeOffset((prev) => (prev + 1) % 10);

                return [
                    ...prev,
                    {
                        id,
                        type: "ImageViewer" as WindowType,
                        minimized: false,
                        maximized: false,
                        zIndex: newZ,
                        x: 160 + offset,
                        y: 100 + offset,
                        width: Math.round(window.innerWidth * 0.5),
                        height: Math.round((window.innerHeight - 40) * 0.6),
                        payload: { imageSrc, imageName },
                    },
                ];
            });
            return newZ;
        });
    };

    const openWindow = (type: WindowType, forceNew = false) => {
        setZCounter((prevZ) => {
            const newZ = prevZ + 1;


            setWindows((prev) => {
                // 🔥 only block duplicates if NOT forcing new
                if (!forceNew) {
                    const existing = prev.find((w) => w.type === type);

                    if (existing) {
                        setActiveWindowId(existing.id);

                        return prev.map((w) =>
                            w.id === existing.id
                                ? { ...w, minimized: false, zIndex: newZ }
                                : w
                        );
                    }
                }

                // 🔥 create new instance
                const id = crypto.randomUUID();
                const offset = cascadeOffset * 30;

                setActiveWindowId(id);
                setCascadeOffset((prev) => (prev + 1) % 10);

                return [
                    ...prev,
                    {
                        id,
                        type,
                        minimized: false,
                        maximized: false,
                        zIndex: newZ,
                        x: 120 + offset,
                        y: 120 + offset,
                        width: Math.round(window.innerWidth * 0.65),
                        height: Math.round((window.innerHeight - 40) * 0.75),
                    },
                ];
            });
            return newZ;
        });
    };

    const focusWindow = (id: string) => {
        setActiveWindowId(id);

        setZCounter((z) => {
            const newZ = z + 1;

            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id
                        ? { ...w, zIndex: newZ }
                        : w
                )
            );

            return newZ;
        });
    };

    const closeWindow = (id: string) => {
        setWindows((prev) => prev.filter((w) => w.id !== id));
    };

    const closeAllWindows = () => {
        setWindows([]);
    };

    const minimizeWindow = (id: string) => {
        setActiveWindowId(null); // ✅ clear focus

        setWindows(prev =>
            prev.map(w =>
                w.id === id ? { ...w, isMinimizing: true } : w
            )
        );

        setTimeout(() => {
            setWindows(prev =>
                prev.map(w =>
                    w.id === id
                        ? { ...w, minimized: true, isMinimizing: false }
                        : w
                )
            );
        }, 200);
    };

    const toggleMaximize = (id: string) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id
                    ? { ...w, maximized: !w.maximized }
                    : w
            )
        );
    };

    const restoreWindow = (id: string) => {
        const offset = cascadeOffset * 30;

        setActiveWindowId(id);

        setZCounter((z) => {
            const newZ = z + 1;

            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id
                        ? {
                            ...w,
                            minimized: false,
                            zIndex: newZ,
                            x: 120 + offset,
                            y: 120 + offset,
                        }
                        : w
                )
            );
            setCascadeOffset((prev) => (prev > 8 ? 0 : prev + 1));

            return newZ;
        });

    };

    return (
        <div className="desktop">

            {/* ICON LAYER */}
            <div className="desktop-icons-layer">
                {ICON_LABELS.map((label, index) => {
                    const column = Math.floor(index / iconsPerColumn);
                    const row = index % iconsPerColumn;

                    const icons: Record<string, { icon: string; onOpen: () => void }> = {
                        Projects: { icon: projects, onOpen: () => openWindow("Projects") },
                        Resume: { icon: resume, onOpen: () => openWindow("Resume") },
                        Gallery: { icon: gallery, onOpen: () => openWindow("Gallery") },
                        Terminal: { icon: terminal, onOpen: () => openWindow("Terminal") },
                        Contact: { icon: contact, onOpen: () => openWindow("Contact") },
                        About: { icon: about, onOpen: () => openWindow("About") },
                    };

                    return (
                        <Icon
                            key={label}
                            label={label}
                            icon={icons[label].icon}
                            onOpen={icons[label].onOpen}
                            top={ICON_START_Y + row * iconSpacing}
                            left={ICON_START_X + column * ICON_WIDTH}
                        />
                    );
                })}
            </div>

            {/* WINDOW LAYER */}
            <div className="desktop-windows-layer" ref={windowsLayerRef}>
                {windows.map((win) =>
                    !win.minimized ? (
                        <Window
                            key={win.id}
                            data={win}
                            onClose={closeWindow}
                            onMinimize={minimizeWindow}
                            onMaximize={toggleMaximize}
                            onFocus={focusWindow}
                            activeWindowId={activeWindowId}
                        >
                            {win.type === "Projects" && <Projects onOpenApp={openWindow} />}
                            {win.type === "About" && <About onOpenApp={openWindow} />}
                            {win.type === "Contact" && <Contact />}
                            {win.type === "Gallery" && <Gallery onOpenImage={openImageWindow} />}
                            {win.type === "ImageViewer" && win.payload && (
                                <img
                                    src={win.payload.imageSrc}
                                    alt={win.payload.imageName}
                                    className="image-viewer-img"
                                />
                            )}
                            {win.type === "Resume" && <Resume />}
                            {win.type === "Terminal" && <Terminal />}
                            {win.type === "Minesweeper" && <Minesweeper />}
                        </Window>
                    ) : null
                )}
            </div>

            {/* TASKBAR */}
            <Taskbar
                windows={windows}
                onRestore={restoreWindow}
                onMinimize={minimizeWindow}
                onOpenApp={openWindow}
                onClose={closeWindow}
                activeWindowId={activeWindowId}
                onCloseAll={closeAllWindows}
                onMaximize={toggleMaximize}
            />
        </div>
    );
}