export default function Resume() {
  const resumeUrl = "/Sergio_TorresResume.pdf";

  return (
    <div className="resume-root">
      <div className="resume-toolbar">
        <button
          className="resume-toolbar-btn"
          onClick={() => window.open(resumeUrl, "_blank")}
        >
          🔗 Open in New Tab
        </button>

        <div className="resume-toolbar-divider" />

        <a
          className="resume-toolbar-btn"
          href={resumeUrl}
          download="Sergio_Torres_Resume.pdf"
        >
          💾 Download
        </a>
      </div>

      <iframe
        src={resumeUrl}
        title="Resume"
        style={{
          border: "none",
          minHeight: "1000px",
          width: "100%",
          height: "90vh"
        }}
      />
    </div>
  );
}