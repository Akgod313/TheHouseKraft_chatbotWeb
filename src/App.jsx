import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ChatPage from "./ChatPage";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --black:      #0a0a0a;
    --charcoal:   #141414;
    --graphite:   #1e1e1e;
    --dim:        #2a2a2a;
    --muted:      #3d3d3d;
    --subtle:     #6b6b6b;
    --ash:        #9a9a9a;
    --silver:     #c8c8c8;
    --pearl:      #e8e4df;
    --cream:      #f5f2ed;
    --white:      #fafafa;
  }

  html, body, #root {
    height: 100%;
    background: var(--black);
    color: var(--pearl);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    letter-spacing: 0.02em;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035;
    pointer-events: none;
    z-index: 9999;
  }

  .hk-root {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    position: relative;
  }

  .hk-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
    z-index: 0;
  }

  .hk-header {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 56px;
    border-bottom: 1px solid var(--dim);
  }

  .hk-logo { display: flex; align-items: baseline; gap: 10px; }

  .hk-logo-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--white);
    text-transform: uppercase;
  }

  .hk-logo-sep {
    width: 1px; height: 16px;
    background: var(--muted);
    display: inline-block;
    vertical-align: middle;
    margin: 0 2px;
  }

  .hk-logo-sub {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.28em;
    color: var(--subtle);
    text-transform: uppercase;
  }

  .hk-header-nav { display: flex; align-items: center; gap: 32px; }

  .hk-nav-link {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ash);
    text-decoration: none;
    transition: color 0.3s;
    cursor: default;
  }

  .hk-nav-link:hover { color: var(--silver); }

  .hk-main {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
  }

  /* ── SIGNED OUT ── */
  .hk-hero {
    max-width: 720px;
    width: 100%;
    text-align: center;
    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hk-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .hk-eyebrow-line { width: 40px; height: 1px; background: var(--muted); }
  .hk-eyebrow-text { font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--subtle); }

  .hk-display {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.01em;
    color: var(--white);
    margin-bottom: 12px;
  }

  .hk-display em { font-style: italic; color: var(--silver); }

  .hk-tagline {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--subtle);
    margin-bottom: 64px;
  }

  .hk-divider {
    width: 1px; height: 60px;
    background: linear-gradient(to bottom, transparent, var(--muted), transparent);
    margin: 0 auto 64px;
  }

  .hk-signin-btn {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 18px 44px;
    background: transparent;
    border: 1px solid var(--muted);
    color: var(--pearl);
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .hk-signin-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--white);
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 0;
  }

  .hk-signin-btn:hover::before { transform: translateX(0); }
  .hk-signin-btn:hover { color: var(--black); border-color: var(--white); }
  .hk-signin-btn span, .hk-signin-arrow { position: relative; z-index: 1; }

  .hk-signin-arrow {
    width: 16px; height: 1px;
    background: currentColor;
    display: inline-block;
    vertical-align: middle;
    transition: width 0.3s;
  }

  .hk-signin-arrow::after {
    content: '';
    position: absolute;
    right: 0; top: -3px;
    width: 6px; height: 6px;
    border-right: 1px solid currentColor;
    border-top: 1px solid currentColor;
    transform: rotate(45deg);
  }

  .hk-signin-btn:hover .hk-signin-arrow { width: 24px; }

  /* ── SIGNED IN ── */
  .hk-dashboard {
    max-width: 600px;
    width: 100%;
    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .hk-welcome-card {
    border: 1px solid var(--dim);
    background: var(--charcoal);
    padding: 56px;
    position: relative;
    overflow: hidden;
  }

  .hk-welcome-card::before, .hk-welcome-card::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    border-color: var(--muted);
    border-style: solid;
  }

  .hk-welcome-card::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
  .hk-welcome-card::after  { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

  .hk-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 48px;
  }

  .hk-card-label {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #fafafa;
    margin-bottom: 8px;
  }

  .hk-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 300;
    letter-spacing: 0.02em;
    color: var(--white);
    line-height: 1.1;
  }

  .hk-status-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid var(--dim);
  }

  .hk-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: pulse 3s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .hk-status-text {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #fafafa;
  }

  .hk-launch-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 28px;
    background: var(--white);
    border: none;
    color: var(--black);
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .hk-launch-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--graphite);
    transform: translateX(101%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 0;
  }

  .hk-launch-btn:hover::before { transform: translateX(0); }
  .hk-launch-btn:hover { color: var(--pearl); }

  .hk-launch-btn-text, .hk-launch-btn-icon { position: relative; z-index: 1; }

  .hk-launch-btn-icon { display: flex; align-items: center; gap: 4px; }

  .hk-launch-line {
    width: 20px; height: 1px;
    background: currentColor;
    transition: width 0.3s;
  }

  .hk-launch-btn:hover .hk-launch-line { width: 32px; }

  .hk-launch-arrow {
    width: 6px; height: 6px;
    border-right: 1px solid currentColor;
    border-top: 1px solid currentColor;
    transform: rotate(45deg);
  }

  .hk-footer {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 56px;
    border-top: 1px solid var(--dim);
  }

  .hk-footer-text {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .hk-footer-dots { display: flex; gap: 6px; }
  .hk-footer-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--dim); }

  @media (max-width: 640px) {
    .hk-header { padding: 20px 24px; }
    .hk-footer { padding: 16px 24px; flex-direction: column; gap: 12px; }
    .hk-welcome-card { padding: 36px 28px; }
    .hk-display { font-size: 52px; }
  }
`;

export default function App() {
  const { user } = useUser();
  const [inChat, setInChat] = useState(false);
  const [fading, setFading] = useState(false);

  const navigateTo = (goToChat) => {
    setFading(true);
    setTimeout(() => {
      setInChat(goToChat);
      setFading(false);
    }, 300);
  };

if (inChat) {
    return (
      <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s ease" }}>
        <ChatPage onBack={() => navigateTo(false)} />
      </div>
    );
  }

  return (
    <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.3s ease" }}>
      <style>{styles}</style>
      <div className="hk-root">

        <header className="hk-header">
          <div className="hk-logo">
            <span className="hk-logo-mark">HouseKraft</span>
            <span className="hk-logo-sep" />
            <span className="hk-logo-sub">Design Studio</span>
          </div>
          <nav className="hk-header-nav">
          </nav>
        </header>

        <main className="hk-main">
          <SignedOut>
            <div className="hk-hero">
              <div className="hk-eyebrow">
                <span className="hk-eyebrow-line" />
                <span className="hk-eyebrow-text">AI-Powered Interior Design</span>
                <span className="hk-eyebrow-line" />
              </div>
              <h1 className="hk-display">
                Design your<br /><em>perfect space</em>
              </h1>
              <p className="hk-tagline">Expert advice. Intelligent vision.</p>
              <div className="hk-divider" />
              <SignInButton mode="modal">
                <button className="hk-signin-btn">
                  <span>Enter Portal</span>
                  <span className="hk-signin-arrow" />
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="hk-dashboard">
              <div className="hk-welcome-card">
                <div className="hk-card-header">
                  <div>
                    <p className="hk-card-label">Welcome back</p>
                    <h2 className="hk-card-name">{user?.firstName || "Homeowner"}</h2>
                  </div>
                  <UserButton afterSignOutUrl={window.location.href} />
                </div>
                <div className="hk-status-row">
                  <span className="hk-status-dot" />
                  <span className="hk-status-text">AI Expert — Online & Ready</span>
                </div>
                <button className="hk-launch-btn" onClick={() => navigateTo(true)}>
                  <span className="hk-launch-btn-text">Launch HouseKraft AI</span>
                  <span className="hk-launch-btn-icon">
                    <span className="hk-launch-line" />
                    <span className="hk-launch-arrow" />
                  </span>
                </button>
              </div>
            </div>
          </SignedIn>
        </main>

        <footer className="hk-footer">
          <span className="hk-footer-text">© {new Date().getFullYear()} HouseKraft — All rights reserved</span>
          <div className="hk-footer-dots">
            <span className="hk-footer-dot" />
            <span className="hk-footer-dot" />
            <span className="hk-footer-dot" />
          </div>
        </footer>

      </div>
    </div>
  );
}