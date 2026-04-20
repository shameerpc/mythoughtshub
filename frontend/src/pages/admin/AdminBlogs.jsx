import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react"; // ADDED 'X' HERE

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([
    { id: 1, title: "Getting Started with React", category: "Development", status: "Published", date: "2023-10-01" },
    { id: 2, title: "Top 10 Tailwind Tips", category: "Design", status: "Draft", date: "2023-10-05" },
    { id: 3, title: "Understanding Hooks", category: "Development", status: "Published", date: "2023-10-12" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this blog?")) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    const form = e.target;
    const newBlog = {
      id: blogs.length + 1,
      title: form.title.value,
      category: form.category.value,
      status: "Draft",
      date: new Date().toISOString().split('T')[0]
    };
    setBlogs([newBlog, ...blogs]);
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Manage Blogs</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="form-control flex-1">
             <div className="input input-bordered flex items-center gap-2 border border-gray-300 rounded-lg px-3">
                <Search className="w-4 h-4 opacity-70"/>
                <input type="text" className="grow border-none focus:outline-none" placeholder="Search blogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
          </div>
          <button className="btn bg-primary text-white hover:bg-blue-600 px-4 py-2 rounded-lg gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4"/> Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs
              .filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800">{blog.title}</div>
                </td>
                <td className="py-3 px-4 text-slate-600">{blog.category}</td>
                <td className="py-3 px-4">
                  <div className={`badge ${blog.status === 'Published' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'} px-3 py-1 rounded-full text-xs font-medium`}>
                    {blog.status}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{blog.date}</td>
                <td className="py-3 px-4 text-right">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit"><Edit className="w-4 h-4"/></button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete" onClick={() => handleDelete(blog.id)}><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">No blogs found.</div>
        )}
      </div>

      {/* Add Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-slate-800">Create New Blog Post</h3>
              {/* X ICON USED HERE */}
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddBlog} className="p-6 space-y-4">
              <div className="form-control">
                <label className="label text-sm font-semibold text-slate-700"><span className="label-text">Title</span></label>
                <input name="title" type="text" placeholder="Enter title" className="input input-bordered w-full border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary" required />
              </div>
              <div className="form-control">
                <label className="label text-sm font-semibold text-slate-700"><span className="label-text">Category</span></label>
                <select name="category" className="select select-bordered w-full border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary">
                  <option>Development</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div className="modal-action mt-6">
                <button type="button" className="btn bg-gray-100 text-slate-700 hover:bg-gray-200 px-4 py-2 rounded-lg" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn bg-primary text-white hover:bg-blue-600 px-4 py-2 rounded-lg">Create Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;