import { useState } from "react";
import BootScreen from "./BootScreen";
import Desktop from "./Desktop";

export default function SergioOS() {
  const [state, setState] = useState<"booting" | "desktop">("booting");

  if (state === "booting") {
    return <BootScreen onComplete={() => setState("desktop")}/>;
  }

  return <Desktop />;
}