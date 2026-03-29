import React from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, blogTitle }) {
  if (!isOpen) return null;

  return (
    <>
      {/* ── SCOPED CSS ── */}
      <style>{`
        @keyframes dm-scale-in { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes dm-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .dm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: dm-fade-in 0.2s ease-out;
        }

        .dm-card {
          background: #fff;
          width: 100%; max-width: 420px;
          border-radius: 1.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          overflow: hidden;
          animation: dm-scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dm-icon-wrap {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          color: #dc2626;
          box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
        }

        .dm-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 0.5rem; font-family: 'Sora', sans-serif; }
        .dm-desc { font-size: 0.95rem; color: #64748b; text-align: center; line-height: 1.5; margin-bottom: 2rem; padding: 0 1rem; }
        
        .dm-actions { display: flex; gap: 0.75rem; padding: 0 1.5rem 1.5rem; }
        
        .dm-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.75rem 1rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s; border: none;
        }
        
        .dm-btn-cancel { background: #f1f5f9; color: #475569; }
        .dm-btn-cancel:hover { background: #e2e8f0; }
        
        .dm-btn-delete {
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: #fff; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .dm-btn-delete:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4); }
        .dm-btn-delete:active { transform: translateY(0); }

        .dm-close-top {
          position: absolute; top: 1rem; right: 1rem;
          width: 32px; height: 32px; border-radius: 50%;
          background: transparent; border: none; color: #94a3b8;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .dm-close-top:hover { color: #475569; background: #f1f5f9; }
      `}</style>

      <div className="dm-overlay" onClick={onClose}>
        <div className="dm-card" onClick={(e) => e.stopPropagation()}>
          {/* Top Close Icon */}
          <button className="dm-close-top" onClick={onClose}>
            <X size={18} />
          </button>

          {/* Content */}
          <div style={{ paddingTop: "2rem" }}>
            <div className="dm-icon-wrap">
              <AlertTriangle size={32} strokeWidth={2.5} />
            </div>
            
            <h3 className="dm-title">Delete post?</h3>
            
            <p className="dm-desc">
              Are you sure you want to delete <strong>"{blogTitle}"</strong>? <br />
              This action cannot be undone and all data will be permanently removed.
            </p>

            {/* Actions */}
            <div className="dm-actions">
              <button className="dm-btn dm-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="dm-btn dm-btn-delete" onClick={onConfirm}>
                <Trash2 size={18} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}