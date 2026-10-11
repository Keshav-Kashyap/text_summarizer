
import React, { useState } from "react";
import axios from "axios";
import "./Summarizer.css";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

const handleSummarize = async () => {
  if (!text.trim()) {
    setError("Please enter some text to summarize.");
    return;
  }

  setLoading(true);
  setError("");
  setSummary("");

  try {
    const response = await axios.post(
      "https://text-summarizer-backend-dh6z.onrender.com/summarize/",
      {
        dialogue: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setSummary(response.data.summary);
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.detail ||
      "Failed to generate summary. Please check the backend."
    );
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => {
    setText("");
    setSummary("");
    setError("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch (err) {
      setError("Unable to copy summary.");
    }
  };

  return (
    <div className="summarizer-page">
      <div className="summarizer-container">

        <section className="hero-section">

          <h1>
            Text Summarizer
            <br />
            <span>using T5 Transformer</span>
          </h1>

          <p>
            Transform lengthy articles, notes, and conversations
            into clear, concise summaries in seconds.
          </p>
        </section>

        <main className="summarizer-grid">

          <section className="panel input-panel">
            <div className="panel-heading">
              <div>
                <span className="step-label">STEP 01</span>
                <h2>Original text</h2>
              </div>

              <button
                className="text-button"
                onClick={handleClear}
                type="button"
              >
                Clear all
              </button>
            </div>

            <textarea
              className="text-input"
              placeholder="Paste your article, notes, report, or conversation here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="input-footer">
              <span>{wordCount} words</span>
              <span>{text.length} characters</span>
            </div>

            <div className="settings-section">
              <label htmlFor="summary-length">
                Summary length
              </label>

              <select
                id="summary-length"
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            <button
              className="summarize-button"
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              type="button"
            >
              {loading ? (
                <>
                  <span className="loader"></span>
                  Generating summary...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Generate summary
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
          </section>

          <section className="panel output-panel">
            <div className="panel-heading">
              <div>
                <span className="step-label">STEP 02</span>
                <h2>AI summary</h2>
              </div>

              <span className="output-tag">OUTPUT</span>
            </div>

            {summary ? (
              <div className="summary-result">
                <div className="result-icon">✦</div>

                <p className="summary-text">{summary}</p>

                <div className="summary-divider"></div>

                <div className="result-footer">
                  <span>✓ Summary generated</span>

                  <button
                    className="copy-button"
                    onClick={handleCopy}
                    type="button"
                  >
                    Copy summary
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="14"
                      y="9"
                      width="36"
                      height="46"
                      rx="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M23 22H41M23 30H41M23 38H35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M49 40L52 46L58 49L52 52L49 58L46 52L40 49L46 46L49 40Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <h3>Your summary awaits</h3>

                <p>
                  Add your text on the left and click
                  {" "}Generate summary to see the magic happen.
                </p>

                <div className="empty-features">
                  <span>✦ Clear insights</span>
                  <span>✦ Less reading</span>
                </div>
              </div>
            )}
          </section>

        </main>

    

      </div>
    </div>
  );
};

export default Summarizer;
