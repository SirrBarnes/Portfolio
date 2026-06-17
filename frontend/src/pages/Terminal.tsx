import { useEffect, useRef, useState } from "react";

// 🟢 CONSTANT BANNER (never changes)
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

export default function Terminal({ onSizeChange, }: { onSizeChange?: (size: { width: number; height: number }) => void; }) {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 50);  // small delay so the window has finished mounting/positioning
  }, []);

  // useEffect(() => {
  //   if (history.length === 0) return;
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [history]);

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

    setHistory((prev) => [
      ...prev,
      ` `,
      `C:\\> ${cmd}`,
      response,
      "",
    ]);

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
      {/* 🟢 VISIBLE RENDER */}
      <div className="dos-history">
        {ASCII_BANNER.map((line, i) => (
          <div key={`banner-${i}`}>{line}</div>
        ))}

        {history.map((line, i) => (
          <div key={`hist-${i}`}>{line}</div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
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