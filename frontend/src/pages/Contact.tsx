import { useState } from "react";

export default function Contact() {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const email = import.meta.env.EMAIL;
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const [errors, setErrors] = useState<{
    from?: string;
    subject?: string;
    message?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!from) {
      newErrors.from = "From address is required.";
    } else if (!isValidEmail(from)) {
      newErrors.from = "Please enter a valid email address.";
    }

    if (!subject) newErrors.subject = "Subject is required.";
    if (!message) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);

    try {
      await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, subject, message }),
      });
      setSent(true);
    } catch (e) {
      alert("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClear = () => {
    setFrom(""); setSubject(""); setMessage("");
    setSent(false); setErrors({});
  };

  return (
    <div className="contact-root">
      {/* Toolbar */}
      <div className="contact-toolbar">
        <button
          className="contact-toolbar-btn"
          onClick={handleSend}
          disabled={sending || sent}
        >
          📤 {sending ? "Sending..." : "Send"}
        </button>
        <div className="contact-toolbar-divider" />
        <button className="contact-toolbar-btn" onClick={handleClear}>
          🗑 Clear
        </button>
      </div>

      {sent ? (
        <div className="contact-sent">
          <div className="contact-sent-icon">✉️</div>
          <p>Message sent successfully!</p>
          <button className="contact-win-btn" onClick={handleClear}>
            New Message
          </button>
        </div>
      ) : (
        <div className="contact-form">
          {/* To */}
          <div className="contact-field-row">
            <label className="contact-field-label">To:</label>
            <input
              className="contact-field-input contact-field-input--disabled"
              placeholder="Sergio Torres"
              value={email}
              readOnly
            />
          </div>

          {/* From */}
          <div className="contact-field-row">
            <label className="contact-field-label">From:</label>
            <div className="contact-field-col">
              <input
                className={`contact-field-input ${errors.from ? "contact-field-input--error" : ""}`}
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
                }}
                placeholder="your@email.com"
              />
              {errors.from && <span className="contact-error">{errors.from}</span>}
            </div>
          </div>

          {/* Subject */}
          <div className="contact-field-row">
            <label className="contact-field-label">Subject:</label>
            <div className="contact-field-col">
              <input
                className={`contact-field-input ${errors.subject ? "contact-field-input--error" : ""}`}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                }}
                placeholder="Hello!"
              />
              {errors.subject && <span className="contact-error">{errors.subject}</span>}
            </div>
          </div>

          <div className="contact-divider" />

          {/* Message */}
          <textarea
            className={`contact-message ${errors.message ? "contact-field-input--error" : ""}`}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
            }}
            placeholder="Write your message here..."
          />
          {errors.message && <span className="contact-error">{errors.message}</span>}
        </div>
      )}
    </div>
  );
}