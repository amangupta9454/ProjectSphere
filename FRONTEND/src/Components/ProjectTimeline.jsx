import { useState } from 'react';
import './ProjectTimeline.css';

const MILESTONE_STEPS = [
  { key: 'PROJECT STARTED',    icon: '🚀', label: 'Project Started' },
  { key: 'PROTOTYPE CREATED',  icon: '⚙️', label: 'Prototype Created' },
  { key: 'PROJECT COMPLETE',   icon: '✅', label: 'Project Complete' },
  { key: 'REPORT PREPARED',    icon: '📝', label: 'Report Prepared' },
  { key: 'PROJECT SUBMITTED',  icon: '🏆', label: 'Project Submitted' },
];

const ProjectTimeline = ({
  timeline = [],
  projectStatus,
  onAddEntry,
  onAddComment,
  currentUserName,
  isStudent = false,
  isFaculty = false,
}) => {
  const [addingEntry, setAddingEntry] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [commentText, setCommentText] = useState({});
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const latestMilestone = timeline.length ? timeline[timeline.length - 1].milestoneStatus : null;
  const latestIdx = MILESTONE_STEPS.findIndex(s => s.key === latestMilestone);

  const handleAddEntry = async () => {
    if (!selectedMilestone) return;
    setSubmitting(true);
    await onAddEntry?.({ milestoneStatus: selectedMilestone, remarks });
    setAddingEntry(false);
    setSelectedMilestone('');
    setRemarks('');
    setSubmitting(false);
  };

  const handleAddComment = async (entryId) => {
    const msg = commentText[entryId]?.trim();
    if (!msg) return;
    setSubmitting(true);
    await onAddComment?.(entryId, msg);
    setCommentText(prev => ({ ...prev, [entryId]: '' }));
    setSubmitting(false);
  };

  const canEdit = isStudent && ['Faculty Accepted', 'Submitted', 'Faculty Assigned'].includes(projectStatus);

  return (
    <div className="ptl-wrapper">
      <div className="ptl-header">
        <h3 className="ptl-title">📊 Project Timeline</h3>
        {canEdit && !addingEntry && (
          <button className="ptl-add-btn" onClick={() => setAddingEntry(true)}>+ Add Milestone</button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="ptl-steps">
        {MILESTONE_STEPS.map((step, idx) => {
          const reached = idx <= latestIdx;
          const active = step.key === latestMilestone;
          return (
            <div key={step.key} className={`ptl-step ${reached ? 'ptl-step-reached' : ''} ${active ? 'ptl-step-active' : ''}`}>
              <div className="ptl-step-icon">{step.icon}</div>
              <div className="ptl-step-label">{step.label}</div>
              {idx < MILESTONE_STEPS.length - 1 && (
                <div className={`ptl-connector ${reached ? 'ptl-connector-active' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Add Milestone Form */}
      {addingEntry && (
        <div className="ptl-add-form">
          <h4 className="ptl-form-title">Log Milestone Update</h4>
          <div className="ptl-milestone-options">
            {MILESTONE_STEPS.map(step => (
              <button
                key={step.key}
                className={`ptl-milestone-opt ${selectedMilestone === step.key ? 'ptl-milestone-opt-selected' : ''}`}
                onClick={() => setSelectedMilestone(step.key)}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </button>
            ))}
          </div>
          <textarea
            className="ptl-textarea"
            placeholder="Add remarks about this milestone (optional)..."
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={3}
          />
          <div className="ptl-form-actions">
            <button className="ptl-btn ptl-btn-ghost" onClick={() => setAddingEntry(false)}>Cancel</button>
            <button className="ptl-btn ptl-btn-primary" onClick={handleAddEntry} disabled={!selectedMilestone || submitting}>
              {submitting ? 'Saving...' : 'Save Milestone'}
            </button>
          </div>
        </div>
      )}

      {/* Timeline Entries */}
      {timeline.length === 0 ? (
        <div className="ptl-empty">
          <span>🏁</span>
          <p>No timeline entries yet. {canEdit ? 'Add your first milestone!' : 'The student has not logged any milestones yet.'}</p>
        </div>
      ) : (
        <div className="ptl-entries">
          {[...timeline].reverse().map((entry, i) => {
            const stepInfo = MILESTONE_STEPS.find(s => s.key === entry.milestoneStatus);
            const isExpanded = expandedEntry === entry._id;
            return (
              <div key={entry._id || i} className="ptl-entry">
                <div className="ptl-entry-dot">{stepInfo?.icon || '📌'}</div>
                <div className="ptl-entry-body">
                  <div className="ptl-entry-header" onClick={() => setExpandedEntry(isExpanded ? null : entry._id)}>
                    <div>
                      <span className="ptl-entry-status">{stepInfo?.label || entry.milestoneStatus}</span>
                      <span className="ptl-entry-time">{new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className="ptl-entry-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  {entry.remarks && <p className="ptl-entry-remarks">{entry.remarks}</p>}

                  {isExpanded && (
                    <div className="ptl-entry-comments">
                      {entry.comments?.length > 0 ? (
                        entry.comments.map((c, ci) => (
                          <div key={ci} className={`ptl-comment ptl-comment-${c.addedModel?.toLowerCase()}`}>
                            <div className="ptl-comment-meta">
                              <span className={`ptl-comment-author ptl-author-${c.addedModel?.toLowerCase()}`}>
                                {c.addedModel === 'Faculty' ? '👨‍🏫' : c.addedModel === 'Hod' ? '🎓' : '👤'} {c.addedByName}
                              </span>
                              <span className="ptl-comment-time">{new Date(c.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                            <p className="ptl-comment-text">{c.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="ptl-no-comments">No comments yet.</p>
                      )}

                      {(isStudent || isFaculty) && (
                        <div className="ptl-comment-input">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText[entry._id] || ''}
                            onChange={e => setCommentText(prev => ({ ...prev, [entry._id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleAddComment(entry._id)}
                          />
                          <button onClick={() => handleAddComment(entry._id)} disabled={submitting}>
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline;
