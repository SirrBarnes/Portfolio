import { useEffect, useState } from "react";

type Props = {
  onComplete: () => void;
};

const bootLines = [
  "SergioOS v1.0",
  "Initializing system...",
  "Loading kernel modules...",
  "Mounting drives...",
  "Starting services...",
  "Launching UI...",
  "Welcome.",
];

// 🔥 random BIOS glitch strings
const glitchChars = "!@#$%^&*()_+-=[]{}|;:<>?/\\";
const randomGlitch = () =>
  Array.from({ length: Math.floor(Math.random() * 8) + 3 })
    .map(
      () =>
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
    )
    .join("");

export default function BootScreen({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [fading, setFading] = useState(false);
  
  // 🔥 fake memory counter
  const [memory, setMemory] = useState(0);

  // 🔥 occasional glitch line
  const [glitchLine, setGlitchLine] = useState("");

  // =====================================
  // MEMORY COUNTUP
  // =====================================
  useEffect(() => {
    if (memory >= 16384) return;

    const interval = setInterval(() => {
      setMemory((prev) => {
        const next = prev + Math.floor(Math.random() * 700 + 200);

        return next >= 16384 ? 16384 : next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [memory]);

  // =====================================
  // RANDOM BIOS GLITCHES
  // =====================================
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.75) {
        setGlitchLine(randomGlitch());

        setTimeout(() => {
          setGlitchLine("");
        }, 80);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // =====================================
  // TYPEWRITER EFFECT
  // =====================================
  useEffect(() => {
    if (index >= bootLines.length) {
      setTimeout(() => {
        setFading(true);
      }, 800);

      setTimeout(() => {
        onComplete();
      }, 1300);

      return;
    }

    const currentLine = bootLines[index];

    const timeout = setTimeout(() => {
      if (charIndex < currentLine.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setOutput((prev) => [...prev, currentLine]);
        setIndex((prev) => prev + 1);
        setCharIndex(0);
      }
    }, Math.random() * 35 + 15);

    return () => clearTimeout(timeout);
  }, [charIndex, index]);

  const currentLine =
    index < bootLines.length
      ? bootLines[index].slice(0, charIndex)
      : "";

  return (
    <div className={`boot-screen ${fading ? "fade-out" : ""}`}>
      {/* 🔥 Fake BIOS memory check */}
      <div className="memory-check">
        Memory Test: {memory} KB OK
      </div>

      <br />

      {/* Boot output */}
      {output.map((line, i) => (
        <div key={i}>{"> " + line}</div>
      ))}

      {index < bootLines.length && (
        <div>
          {"> " + currentLine}
          <span className="cursor">_</span>
        </div>
      )}

      {/* 🔥 Random glitch line */}
      {glitchLine && (
        <div className="bios-glitch">
          {glitchLine}
        </div>
      )}
    </div>
  );
}