import { useState } from "react";
import { CheckCircle, XCircle, Trash2, User } from "lucide-react";

const AdminComments = () => {
  const [comments, setComments] = useState([
    { id: 1, user: "John Doe", text: "Great article! Really helped me understand hooks.", status: "Pending", date: "2 mins ago" },
    { id: 2, user: "SpamBot99", text: "Click here for free money!!!", status: "Pending", date: "1 hour ago" },
    { id: 3, user: "Alice Smith", text: "Thanks for sharing.", status: "Approved", date: "1 day ago" },
  ]);

  const updateStatus = (id, newStatus) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const deleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comment Moderation</h1>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="card bg-base-100 shadow border border-base-300">
            <div className="card-body p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <User className="w-4 h-4"/>
                    </div>
                  </div>
                  <span className="font-bold">{comment.user}</span>
                  <span className="text-xs text-gray-400">{comment.date}</span>
                  <div className={`badge badge-sm ${comment.status === 'Approved' ? 'badge-success' : comment.status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}>
                    {comment.status}
                  </div>
                </div>
                <p className="text-gray-600 pl-11">"{comment.text}"</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {comment.status === 'Pending' && (
                  <>
                    <button className="btn btn-sm btn-success btn-outline gap-1" onClick={() => updateStatus(comment.id, 'Approved')}>
                      <CheckCircle className="w-4 h-4"/> Approve
                    </button>
                    <button className="btn btn-sm btn-error btn-outline gap-1" onClick={() => updateStatus(comment.id, 'Rejected')}>
                      <XCircle className="w-4 h-4"/> Reject
                    </button>
                  </>
                )}
                <button className="btn btn-sm btn-ghost text-red-500" onClick={() => deleteComment(comment.id)}>
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComments;