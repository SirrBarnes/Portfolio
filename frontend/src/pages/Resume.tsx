import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Resume() {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(900);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeUrl = "/Sergio_TorresResume.pdf";

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      // subtract a little padding so the page isn't flush against the edges
      setContainerWidth(entry.contentRect.width - 24);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="resume-root">
      <div className="resume-toolbar">
        <button className="resume-toolbar-btn" onClick={() => window.open(resumeUrl, "_blank")}>
          🔗 Open in New Tab
        </button>
        <div className="resume-toolbar-divider" />
        <a className="resume-toolbar-btn" href={resumeUrl} download="Sergio_Torres_Resume.pdf">
          💾 Download
        </a>
      </div>

      <div className="resume-pdf-scroll" ref={containerRef}>
        <Document file={resumeUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={containerWidth}
              devicePixelRatio={window.devicePixelRatio * 2}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}