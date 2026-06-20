import { useEffect, useRef, useState } from "react";

const ASCII_BANNER = [
  "  █████████                               ███              ███████     █████████",
  " ███░░░░░███                             ░░░             ███░░░░░███  ███░░░░░███",
  "░███    ░░░   ██████  ████████   ███████ ████   ██████  ███     ░░███░███    ░░░",
  "░░█████████  ███░░███░░███░░███ ███░░███░░███  ███░░███░███      ░███░░█████████",
  " ░░░░░░░░███░███████  ░███ ░░░ ░███ ░███ ░███ ░███ ░███░███      ░███ ░░░░░░░░███",
  " ███    ░███░███░░░   ░███     ░███ ░███ ░███ ░███ ░███░░███     ███  ███    ░███",
  "░░█████████ ░░██████  █████    ░░███████ █████░░██████  ░░░███████░  ░░█████████",
  " ░░░░░░░░░   ░░░░░░  ░░░░░      ░░░░░███░░░░░  ░░░░░░     ░░░░░░░     ░░░░░░░░░  ",
  "                                ███ ░███",
  "                               ░░██████",
  "                                ░░░░░░",
  "",
  "S E R G I O   O S   v1.0",
  "Type HELP for available commands",
  "",
];

// longest line length, used to calculate the scale factor
const LONGEST_LINE = Math.max(...ASCII_BANNER.map((l) => l.length));

export default function Terminal({ }: { onSizeChange?: (size: { width: number; height: number }) => void }) {
  const [, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState<number>(-1);

  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [bannerFontSize, setBannerFontSize] = useState(16);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 50);
  }, []);

  // 🟢 scale the banner to fit the available width
  useEffect(() => {
    if (!historyRef.current) return;

    const el = historyRef.current;

    const calculateFit = () => {
      const availableWidth = el.clientWidth - 16; // minus padding
      // monospace char width is roughly 0.6 * font-size for Courier New
      const charWidthRatio = 0.6;
      const maxFontSize = availableWidth / (LONGEST_LINE * charWidthRatio);

      // clamp so it never goes above the normal 16px or below a readable floor
      const clamped = Math.max(6, Math.min(16, maxFontSize));
      setBannerFontSize(clamped);
    };

    calculateFit();

    const observer = new ResizeObserver(calculateFit);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleCommand = () => {
    const cmd = input.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    let response = "";

    switch (lower) {
      case "help":
        response = "HELP ABOUT PROJECTS CLEAR";
        break;

      case "about":
        response = "Sergio - Full Stack Developer";
        break;

      case "projects":
        response = "AutoShop, GitHub Finder...";
        break;

      case "clear":
        setHistory([]);
        setInput("");
        setCommandHistory([]);
        setHistoryIndex(-1);
        return;

      default:
        response = "Bad command or file name";
    }

    setHistory((prev) => [...prev, ` `, `C:\\> ${cmd}`, response, ""]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput("");
  };

  return (
    <div
      ref={terminalRef}
      className="dos-terminal"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="dos-history" ref={historyRef}>
        <div
          className="dos-banner"
          style={{ fontSize: `${bannerFontSize}px`, lineHeight: 1.1 }}
        >
          {ASCII_BANNER.map((line, i) => (
            <div key={`banner-${i}`}>{line}</div>
          ))}
        </div>

        {history.map((line, i) => (
          <div key={`hist-${i}`}>{line}</div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="dos-input-line">
        <span>C:\&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand();
              return;
            }
          }}
          className="dos-input"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}