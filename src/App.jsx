
import { useState, useRef, useEffect } from "react";
import "./App.css";

const suggestions = [
  "Where is King's College of Engineering?",
  "What courses are available?",
  "Tell me about placements",
  "How can I contact the college?",
];

function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Vanakkam! Welcome to King's College AI Assistant. 👋\n\nI can help you with questions about King's College of Engineering, Punalkulam. Ask me about admissions, courses, placements, facilities, and more!",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e, suggestedQuestion) {
    if (e) e.preventDefault();

    const userQuestion = (
      typeof suggestedQuestion === "string"
        ? suggestedQuestion
        : question
    ).trim();

    if (!userQuestion || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        throw new Error("The server returned an error.");
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: data.answer || "Sorry, I couldn't find an answer.",
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: "I couldn't connect to the server. Please make sure the Python backend is running on port 8000 and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        role: "bot",
        text: "Chat cleared! 👋 Ask me anything about King's College of Engineering, Punalkulam.",
      },
    ]);
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#" aria-label="King's College AI home">
          <div className="brand-logo">K<span>AI</span></div>
          <div>
            <div className="brand-title">Kings College of Engineering</div>
            <div className="brand-subtitle">Kings Chatbot</div>
          </div>
        </a>

        <div className="status">
          <span className="status-dot"></span>
          College Help Desk
        </div>
      </header>

      <main className="main-layout">
        <section className="hero">
          <div className="eyebrow">
            <span className="sparkle">✦</span>
            YOUR CAMPUS, SIMPLIFIED
          </div>

          <h1>
            Ask your college.
            <br />
            <span>Get clear answers.</span>
          </h1>

          <p className="hero-description">
            Your AI-powered guide to Kings College of Engineering,
            Punalkulam. Find college information through one simple chat.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span className="feature-icon">✧</span>
              College-focused answers
            </div>
            <div className="feature">
              <span className="feature-icon">◷</span>
              Easy and quick to use
            </div>
            <div className="feature">
              <span className="feature-icon">⌁</span>
              Simple chat interface
            </div>
          </div>
        </section>

        <section className="chat-card">
          <div className="chat-header">
            <div className="assistant-avatar">K<span>AI</span></div>
            <div className="chat-heading">
              <h2>Kings College of Engineering Assistant</h2>
              <p><span className="status-dot"></span> Ready to help</p>
            </div>
            <button
              className="clear-button"
              onClick={clearChat}
              type="button"
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              ↻
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`message-row ${message.role}`}
              >
                {message.role === "bot" && (
                  <div className="message-avatar">K</div>
                )}

                <div className="message-content">
                  <div className="message-label">
                    {message.role === "bot" ? "College Assistant" : "You"}
                  </div>
                  <div className="message-bubble">
                    {message.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <div className="message-avatar">Kings</div>
                <div className="message-content">
                  <div className="message-label">College Assistant</div>
                  <div className="message-bubble typing">
                    <span></span><span></span><span></span>
                    <small>Finding your answer...</small>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="suggestion-area">
            <p className="suggestion-title">TRY ASKING</p>
            <div className="suggestions">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="suggestion"
                  disabled={loading}
                  onClick={() => sendMessage(null, item)}
                >
                  {item}
                  <span>↗</span>
                </button>
              ))}
            </div>
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about admissions, courses, placements..."
              aria-label="Ask a question"
              disabled={loading}
            />
            <button
              className="send-button"
              type="submit"
              disabled={loading || !question.trim()}
              aria-label="Send message"
            >
              {loading ? "…" : "↑"}
            </button>
          </form>

          <p className="disclaimer">
            AI-generated answers may need verification. Confirm important
            details with the official college.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>King's College AI Assistant</span>
        <span>Designed for campus information</span>
      </footer>
    </div>
  );
}

export default App;
