import { useState, useEffect, useRef, useCallback } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";

const API = "http://localhost:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  .hk-chat-root {
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-template-rows: 100vh;
    height: 100vh;
    background: var(--black, #0a0a0a);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--pearl, #e8e4df);
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .hk-sidebar {
    background: var(--charcoal, #141414);
    border-right: 1px solid var(--dim, #2a2a2a);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    z-index: 10;
  }

  .hk-sidebar-header {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--dim, #2a2a2a);
  }

  .hk-sidebar-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--white, #fafafa);
    margin-bottom: 4px;
  }

  .hk-sidebar-sub {
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--subtle, #fafafa);
  }

  .hk-sidebar-user {
    padding: 20px 24px;
    border-bottom: 1px solid var(--dim, #2a2a2a);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hk-sidebar-user-info {
    flex: 1;
    min-width: 0;
  }

  .hk-sidebar-user-label {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--subtle, #fafafa);
    margin-bottom: 3px;
  }

  .hk-sidebar-user-name {
    font-size: 13px;
    font-weight: 400;
    color: var(--silver, #c8c8c8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hk-sidebar-body {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hk-sidebar-section-label {
    font-size: 9px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--muted, #fafafa);
    margin-bottom: 4px;
  }

  .hk-sidebar-footer {
    padding: 20px 24px;
    border-top: 1px solid var(--dim, #2a2a2a);
  }

  .hk-clear-btn {
    width: 100%;
    padding: 11px 16px;
    background: transparent;
    border: 1px solid var(--dim, #2a2a2a);
    color: var(--ash, #9a9a9a);
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .hk-clear-btn:hover {
    border-color: var(--muted, #3d3d3d);
    color: var(--silver, #c8c8c8);
  }

  .hk-back-btn {
    width: 100%;
    padding: 11px 16px;
    background: transparent;
    border: 1px solid var(--dim, #2a2a2a);
    color: var(--ash, #9a9a9a);
    font-family: 'Jost', sans-serif;
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .hk-back-btn:hover {
    border-color: var(--muted, #3d3d3d);
    color: var(--silver, #c8c8c8);
  }

  /* ── MAIN CHAT AREA ── */
  .hk-chat-main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  /* Architectural grid bg */
  .hk-chat-main::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.012) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.012) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
    z-index: 0;
  }

  .hk-chat-topbar {
    position: relative;
    z-index: 5;
    padding: 20px 36px;
    border-bottom: 1px solid var(--dim, #2a2a2a);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .hk-chat-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: var(--white, #fafafa);
    letter-spacing: 0.04em;
  }

  .hk-status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--subtle, #6b6b6b);
  }

  .hk-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background:  #4ade80;
    animation: pulse 3s ease-in-out infinite;
  }

  .hk-status-dot.thinking {
    background: #facc15;
    animation: pulse 0.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }

  /* ── MESSAGES ── */
  .hk-messages {
    position: relative;
    z-index: 1;
    flex: 1;
    overflow-y: auto;
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    scroll-behavior: smooth;
  }

  .hk-messages::-webkit-scrollbar { width: 3px; }
  .hk-messages::-webkit-scrollbar-track { background: transparent; }
  .hk-messages::-webkit-scrollbar-thumb { background: var(--dim, #2a2a2a); border-radius: 2px; }

  .hk-empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    opacity: 0;
    animation: fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hk-empty-icon {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 300;
    color: var(--dim, #2a2a2a);
  }

  .hk-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    color: var(--muted, #fafafa);
    text-align: center;
  }

  .hk-empty-sub {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted, #fafafa);
    text-align: center;
  }

  /* ── MESSAGE BUBBLES ── */
  .hk-msg {
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0;
    animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
    max-width: 78%;
  }

  .hk-msg.user  { align-self: flex-end; align-items: flex-end; }
  .hk-msg.assistant { align-self: flex-start; align-items: flex-start; }

  .hk-msg-label {
    font-size: 8px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--ash, #9a9a9a);
    padding: 0 4px;
    font-weight: bold;
  }

  .hk-msg-bubble {
    padding: 16px 20px;
    line-height: 1.7;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.01em;
    position: relative;
  }

  .hk-msg.user .hk-msg-bubble {
    background: var(--charcoal, #141414);
    border: 1px solid var(--dim, #2a2a2a);
    color: var(--pearl, #e8e4df);
    border-radius: 2px 2px 0 2px;
  }

  .hk-msg.assistant .hk-msg-bubble {
    background: transparent;
    border: 1px solid var(--graphite, #1e1e1e);
    color: var(--silver, #c8c8c8);
    border-radius: 2px 2px 2px 0;
  }

  /* Corner accent on assistant bubble */
  .hk-msg.assistant .hk-msg-bubble::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 10px; height: 10px;
    border-top: 1px solid var(--muted, #3d3d3d);
    border-left: 1px solid var(--muted, #3d3d3d);
  }

  .hk-msg-image {
    max-width: 280px;
    max-height: 200px;
    object-fit: cover;
    border: 1px solid var(--dim, #2a2a2a);
  }

  /* Streaming cursor */
  .hk-cursor {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: var(--ash, #9a9a9a);
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 1s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* ── INPUT AREA ── */
  .hk-input-area {
    position: relative;
    z-index: 5;
    padding: 20px 36px 28px;
    border-top: 1px solid var(--dim, #2a2a2a);
    flex-shrink: 0;
    background: var(--black, #0a0a0a);
  }

  /* Image preview */
  .hk-image-preview {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hk-preview-thumb {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border: 1px solid var(--dim, #2a2a2a);
  }

  .hk-preview-remove {
    background: none;
    border: none;
    color: var(--subtle, #6b6b6b);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    line-height: 1;
    transition: color 0.2s;
  }

  .hk-preview-remove:hover { color: var(--silver, #c8c8c8); }

  .hk-input-row {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    background: var(--charcoal, #141414);
    border: 1px solid var(--dim, #2a2a2a);
    padding: 4px 4px 4px 16px;
    transition: border-color 0.3s;
  }

  .hk-input-row:focus-within {
    border-color: var(--muted, #3d3d3d);
  }

  .hk-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--pearl, #e8e4df);
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.02em;
    resize: none;
    line-height: 1.6;
    padding: 10px 0;
    min-height: 22px;
    max-height: 140px;
    overflow-y: auto;
  }

  .hk-textarea::placeholder {
    color: var(--muted, #3d3d3d);
  }

  .hk-textarea::-webkit-scrollbar { width: 2px; }
  .hk-textarea::-webkit-scrollbar-thumb { background: var(--dim, #2a2a2a); }

  .hk-input-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    flex-shrink: 0;
  }

  .hk-icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--subtle, #6b6b6b);
    cursor: pointer;
    transition: color 0.2s;
    border-radius: 1px;
  }

  .hk-icon-btn:hover { color: var(--silver, #c8c8c8); }

  .hk-send-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white, #fafafa);
    border: none;
    color: var(--black, #0a0a0a);
    cursor: pointer;
    transition: all 0.25s;
    flex-shrink: 0;
  }

  .hk-send-btn:hover:not(:disabled) { background: var(--silver, #c8c8c8); }
  .hk-send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .hk-input-hint {
    margin-top: 10px;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted, #adadad);
    text-align: center;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .hk-chat-root { grid-template-columns: 1fr; }
    .hk-sidebar { display: none; }
    .hk-messages { padding: 20px 20px; }
    .hk-input-area { padding: 16px 20px 20px; }
    .hk-chat-topbar { padding: 16px 20px; }
    .hk-msg { max-width: 90%; }
  }
`;

// Simple markdown-like renderer for bold/code
function renderText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8e4df;font-weight:500">$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:#1e1e1e;padding:2px 6px;font-size:12px;letter-spacing:0">$1</code>')
    .replace(/\n/g, '<br/>');
}

function Message({ msg, isStreaming }) {
  return (
    <div className={`hk-msg ${msg.role}`}>
      <span className="hk-msg-label">
        {msg.role === "user" ? "You" : "HouseKraft AI"}
      </span>
      {msg.image && (
        <img src={msg.image} alt="attachment" className="hk-msg-image" />
      )}
      <div className="hk-msg-bubble">
        <span dangerouslySetInnerHTML={{ __html: renderText(msg.content) }} />
        {isStreaming && <span className="hk-cursor" />}
      </div>
    </div>
  );
}

export default function ChatPage({ onBack }) {
  const { user } = useUser();
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isStreaming, setIsStreaming]   = useState(false);
  const [isLoading, setIsLoading]       = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);
  const textareaRef    = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load history on mount
  useEffect(() => {
    if (!user) return;
    fetch(`${API}/history`, {
      headers: { "x-user-id": user.id }
    })
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [user]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming || !user) return;

    const userMsg = {
      role: "user",
      content: input.trim(),
      image: imagePreview || null
    };

    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    removeImage();
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Placeholder assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const formData = new FormData();
      formData.append("message", userMsg.content);
      formData.append("history", JSON.stringify(historyForApi));
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "x-user-id": user.id },
        body: formData,
      });

      if (!response.ok) throw new Error("Request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        // Update the last message (the streaming assistant bubble) in real time
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
        scrollToBottom();
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again."
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [input, imageFile, imagePreview, messages, isStreaming, user]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    await fetch(`${API}/history`, {
      method: "DELETE",
      headers: { "x-user-id": user.id }
    });
    setMessages([]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hk-chat-root">

        {/* ── SIDEBAR ── */}
        <aside className="hk-sidebar">
          <div className="hk-sidebar-header">
            <div className="hk-sidebar-logo">HouseKraft</div>
            <div className="hk-sidebar-sub">AI Expert</div>
          </div>

          <div className="hk-sidebar-user">
            <UserButton afterSignOutUrl="/" />
            <div className="hk-sidebar-user-info">
              <div className="hk-sidebar-user-label">Logged in as</div>
              <div className="hk-sidebar-user-name">{user?.firstName || "Homeowner"}</div>
            </div>
          </div>

          <div className="hk-sidebar-body">
            <div className="hk-sidebar-section-label">Session</div>
            <div style={{ fontSize: "11px", color: "var(--subtle, #6b6b6b)", lineHeight: 1.6 }}>
              {messages.length} message{messages.length !== 1 ? "s" : ""} in this conversation
            </div>
          </div>

          <div className="hk-sidebar-footer">
            {onBack && (
              <button className="hk-back-btn" onClick={onBack}>
                ← Back to Portal
              </button>
            )}
            <button className="hk-clear-btn" onClick={clearHistory}>
              Clear History
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="hk-chat-main">
          <div className="hk-chat-topbar">
            <span className="hk-chat-title">Design Expert</span>
            <div className="hk-status-badge">
              <span className={`hk-status-dot ${isStreaming ? "thinking" : ""}`} />
              {isStreaming ? "Thinking..." : "Online"}
            </div>
          </div>

          <div className="hk-messages">
            {isLoading ? (
              <div className="hk-empty-state">
                <div className="hk-empty-title" style={{ fontSize: "14px", color: "var(--muted)" }}>
                  Loading your conversation...
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="hk-empty-state">
                <div className="hk-empty-title">How can I help you today?</div>
                <div className="hk-empty-sub">Ask about design, repairs, or home improvement</div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <Message
                  key={i}
                  msg={msg}
                  isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT ── */}
          <div className="hk-input-area">
            {imagePreview && (
              <div className="hk-image-preview">
                <img src={imagePreview} alt="preview" className="hk-preview-thumb" />
                <button className="hk-preview-remove" onClick={removeImage}>✕</button>
                <span style={{ fontSize: "10px", color: "var(--subtle)", letterSpacing: "0.15em" }}>
                  Image attached
                </span>
              </div>
            )}

            <div className="hk-input-row">
              <textarea
                ref={textareaRef}
                className="hk-textarea"
                placeholder="Ask about your home..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isStreaming}
              />
              <div className="hk-input-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpg,image/jpeg,image/png"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
                <button
                  className="hk-icon-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach image"
                  disabled={isStreaming}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="1"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </button>
                <button
                  className="hk-send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || isStreaming}
                  title="Send (Enter)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="hk-input-hint">Enter to send · Shift+Enter for new line</div>
          </div>
        </main>

      </div>
    </>
  );
}   