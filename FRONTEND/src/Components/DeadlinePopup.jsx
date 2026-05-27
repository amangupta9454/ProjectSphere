import { useState, useEffect, useRef, useCallback } from 'react';
import './DeadlinePopup.css';

/**
 * DeadlinePopup — Smart animated deadline notification popup.
 * Shows urgent alerts at 10-day, 2-day, and final deadline triggers.
 * Plays a subtle audio chime on appear.
 */
const DeadlinePopup = ({ deadlines = [], onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ps_dismissed_deadlines') || '[]');
    } catch { return []; }
  });
  const audioRef = useRef(null);

  // Categorize deadlines
  const urgentDeadlines = deadlines.filter(d => {
    const daysLeft = Math.ceil((new Date(d.dueDate) - new Date()) / 86400000);
    const key = `${d._id}-${daysLeft <= 0 ? 'final' : daysLeft <= 2 ? '2day' : daysLeft <= 10 ? '10day' : null}`;
    if (dismissed.includes(key)) return false;
    return daysLeft <= 10 && daysLeft >= 0;
  }).map(d => {
    const daysLeft = Math.ceil((new Date(d.dueDate) - new Date()) / 86400000);
    const level = daysLeft === 0 ? 'final' : daysLeft <= 2 ? 'critical' : 'warning';
    return { ...d, daysLeft, level };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  useEffect(() => {
    if (urgentDeadlines.length > 0) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [urgentDeadlines.length]);

  useEffect(() => {
    if (visible) {
      // Play subtle audio notification
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (_) {}
    }
  }, [visible]);

  const handleDismiss = useCallback((deadline, level) => {
    const key = `${deadline._id}-${level === 'final' ? 'final' : level === 'critical' ? '2day' : '10day'}`;
    const updated = [...dismissed, key];
    setDismissed(updated);
    localStorage.setItem('ps_dismissed_deadlines', JSON.stringify(updated));

    if (currentIdx < urgentDeadlines.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setVisible(false);
      onDismiss?.();
    }
  }, [dismissed, currentIdx, urgentDeadlines.length, onDismiss]);

  const handleDismissAll = useCallback(() => {
    const keys = urgentDeadlines.map(d => {
      const level = d.level;
      return `${d._id}-${level === 'final' ? 'final' : level === 'critical' ? '2day' : '10day'}`;
    });
    const updated = [...dismissed, ...keys];
    setDismissed(updated);
    localStorage.setItem('ps_dismissed_deadlines', JSON.stringify(updated));
    setVisible(false);
    onDismiss?.();
  }, [dismissed, urgentDeadlines, onDismiss]);

  if (!visible || urgentDeadlines.length === 0) return null;

  const current = urgentDeadlines[currentIdx];
  const { daysLeft, level } = current;

  const icon = level === 'final' ? '🚨' : level === 'critical' ? '⚠️' : '📅';
  const levelLabel = level === 'final' ? 'DUE TODAY!' : level === 'critical' ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : `${daysLeft} days left`;

  return (
    <div className="dp-backdrop" role="dialog" aria-modal="true" aria-label="Deadline notification">
      <div className={`dp-card dp-${level}`}>
        <div className="dp-header">
          <div className="dp-icon-wrap">
            <span className="dp-icon">{icon}</span>
            <div className={`dp-pulse dp-pulse-${level}`} />
          </div>
          <div className="dp-header-text">
            <span className={`dp-badge dp-badge-${level}`}>{levelLabel}</span>
            <h2 className="dp-title">
              {level === 'final' ? 'Final Deadline Today!' : level === 'critical' ? 'Urgent Deadline Alert' : 'Upcoming Deadline Reminder'}
            </h2>
          </div>
          <button className="dp-close" onClick={() => handleDismissAll()} aria-label="Close all notifications">✕</button>
        </div>

        <div className="dp-body">
          <div className={`dp-deadline-card dp-dc-${level}`}>
            <p className="dp-deadline-title">{current.title}</p>
            {current.description && <p className="dp-deadline-desc">{current.description}</p>}
            <div className="dp-deadline-meta">
              <span>📅 {new Date(current.dueDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {level !== 'warning' && (
            <ul className="dp-checklist">
              <li>✔ Ensure all project files are uploaded</li>
              <li>✔ GitHub repository link is updated</li>
              <li>✔ Final report is ready</li>
            </ul>
          )}
        </div>

        <div className="dp-footer">
          {urgentDeadlines.length > 1 && (
            <span className="dp-count">{currentIdx + 1} of {urgentDeadlines.length} alerts</span>
          )}
          <div className="dp-actions">
            {urgentDeadlines.length > 1 && currentIdx < urgentDeadlines.length - 1 && (
              <button className="dp-btn dp-btn-secondary" onClick={() => handleDismiss(current, level)}>
                Next Alert →
              </button>
            )}
            <button className={`dp-btn dp-btn-${level}`} onClick={() => handleDismissAll()}>
              Got it, Dismiss All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlinePopup;
