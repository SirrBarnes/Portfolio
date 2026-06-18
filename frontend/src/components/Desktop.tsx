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

type WindowType = "Projects" | "About" | "Terminal" | "Contact" | "Resume" | "Gallery" | "Minesweeper";

type WindowData = {
    id: string;
    type: WindowType;
    minimized: boolean;
    maximized: boolean;
    zIndex: number;
    isMinimizing?: boolean;
    x?: number;
    y?: number;

    width?: number;
    height?: number;
};


export default function Desktop() {
    const [windows, setWindows] = useState<WindowData[]>([]);
    const [, setZCounter] = useState(1);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [cascadeOffset, setCascadeOffset] = useState(0);
    // const desktopWidth = window.innerWidth;
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
                        width: 1100,   // cap terminal
                        height: 850,
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
                <Icon
                    index={0}
                    label="Projects"
                    icon={projects}
                    onOpen={() => openWindow("Projects")}
                />

                <Icon
                    index={1}
                    label="Resume"
                    icon={resume}
                    onOpen={() => openWindow("Resume")}
                />

                <Icon
                    index={2}
                    label="Gallery"
                    icon={gallery}
                    onOpen={() => openWindow("Gallery")}
                />

                <Icon
                    index={3}
                    label="Terminal"
                    icon={terminal}
                    onOpen={() => openWindow("Terminal")}
                />

                <Icon
                    index={4}
                    label="Contact"
                    icon={contact}
                    onOpen={() => openWindow("Contact")}
                />

                <Icon
                    index={5}
                    label="About"
                    icon={about}
                    onOpen={() => openWindow("About")}
                />
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
                            {win.type === "Projects" && <Projects />}
                            {win.type === "About" && <About />}
                            {win.type === "Contact" && <Contact />}
                            {win.type === "Gallery" && <Gallery />}
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