export default function Resume() {
    const resumeUrl = "/Sergio_TorresResume.pdf";
    const resumeDownloadUrl = "/Sergio_TorresResume.pdf";

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = resumeDownloadUrl;
        a.download = "Sergio_Torres_Resume.pdf";
        a.click();
    };

    const handleOpenNew = () => {
        window.open(resumeUrl, "_blank");
    };

    return (
        <div className="resume-root">
            {/* Toolbar */}
            <div className="resume-toolbar">
                <button className="resume-toolbar-btn" onClick={handleOpenNew}>
                    🔗 Open in New Tab
                </button>
                <div className="resume-toolbar-divider" />
                <button className="resume-toolbar-btn" onClick={handleDownload}>
                    💾 Download
                </button>
            </div>

            {/* PDF Viewer */}
            <iframe
                src={`${resumeUrl}#zoom=page-width`}
                className="resume-iframe"
                title="Resume"
            />
        </div>
    );
}