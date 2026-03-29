import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAllCategories } from "../api/category.api";
import { createBlog, updateBlog } from "../api/blog.api";
import {
  Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter,
  Upload, X, Loader2, CheckCircle2, ChevronDown, Edit3, Plus
} from "lucide-react";

// ─────────────────────────────────────────────
// RICH TEXT EDITOR
// ─────────────────────────────────────────────
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-300 rounded-lg cb-editor-wrap">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 cb-toolbar bg-gray-50">
        {[{ cmd: "bold", icon: <Bold size={15} /> }, { cmd: "italic", icon: <Italic size={15} /> }].map(({ cmd, icon }) => (
          <button key={cmd} type="button" className="p-2 text-gray-600 rounded hover:bg-gray-200" onMouseDown={(e) => { e.preventDefault(); execCommand(cmd); }}>
            {icon}
          </button>
        ))}
        <span className="w-px h-4 mx-1 bg-gray-300" />
        {[{ cmd: "justifyLeft", icon: <AlignLeft size={15} /> }, { cmd: "justifyCenter", icon: <AlignCenter size={15} /> }].map(({ cmd, icon }) => (
          <button key={cmd} type="button" className="p-2 text-gray-600 rounded hover:bg-gray-200" onMouseDown={(e) => { e.preventDefault(); execCommand(cmd); }}>
            {icon}
          </button>
        ))}
        <span className="w-px h-4 mx-1 bg-gray-300" />
        {[{ cmd: "insertUnorderedList", icon: <List size={15} /> }, { cmd: "insertOrderedList", icon: <ListOrdered size={15} /> }].map(({ cmd, icon }) => (
          <button key={cmd} type="button" className="p-2 text-gray-600 rounded hover:bg-gray-200" onMouseDown={(e) => { e.preventDefault(); execCommand(cmd); }}>
            {icon}
          </button>
        ))}
      </div>
      <div 
        ref={editorRef} 
        contentEditable 
        onInput={handleInput} 
        className="cb-editor-body p-4 min-h-[200px] outline-none bg-white" 
        style={{ wordBreak: "break-word" }} 
        data-placeholder="Start writing your story here…" 
      />
      <style>{`.cb-editor-body:empty:before{content:attr(data-placeholder);color:#94a3b8;pointer-events:none;}`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────
// MULTI-IMAGE UPLOADER WITH ALT TEXT
// ─────────────────────────────────────────────
const ImageUploader = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback((files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file),
      alt: "" 
    }));
    onChange([...(value || []), ...newImages]);
  }, [value, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const updateAlt = (index, altText) => {
    const newImages = [...value];
    newImages[index].alt = altText;
    onChange(newImages);
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50 hover:bg-indigo-50"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload size={32} className="text-indigo-500" />
          <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG (Max 5 images)</p>
        </div>
      </div>

      {value && value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {value.map((img, index) => (
            <div key={index} className="relative overflow-hidden border rounded-lg group bg-gray-50">
              <img src={img.url} alt={`Preview ${index}`} className="object-cover w-full h-32" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
                <button type="button" onClick={() => removeImage(index)} className="p-1 text-white bg-red-500 rounded-full hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90">
                <input
                  type="text"
                  placeholder="Alt text (SEO)"
                  value={img.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  className="w-full p-1 text-xs border rounded outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function CreateBlogForm({ isOpen, onClose, initialData }) {
  const [formData, setFormData] = useState({
    title: "", category: "", description: "", images: [] 
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        const cats = res.response || res || []; 
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          category: initialData.category?._id || initialData.category || "",
          description: initialData.description || "",
          // Map existing images to the format the uploader expects
          images: initialData.images?.map(img => ({ 
            url: img.url, 
            alt: img.alt || "" 
          })) || []
        });
      } else {
        setFormData({ title: "", category: "", description: "", images: [] });
      }
      setError(""); 
      setSuccess(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category) { setError("Please select a category."); return; }
    if (!formData.title.trim()) { setError("Title is required."); return; }

    const plainText = formData.description.replace(/<[^>]*>?/gm, "");
    if (!plainText.trim()) { setError("Content cannot be empty."); return; }

    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("category", formData.category);
      dataToSend.append("description", formData.description);

      // ── IMAGE HANDLING LOGIC ──
      const alts = [];
      const existingImageUrls = [];

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((imgObj) => {
          if (imgObj.file) {
            // 1. It's a new file upload
            dataToSend.append("images", imgObj.file);
            alts.push(imgObj.alt || "");
          } else if (imgObj.url && isEdit) {
            // 2. It's an existing image (Edit mode only)
            // We collect URLs to send to backend so it knows not to delete them
            existingImageUrls.push({ url: imgObj.url, alt: imgObj.alt || "" });
          }
        });
      }

      // Send Alts for new files
      if (alts.length > 0) {
        dataToSend.append("alts", JSON.stringify(alts));
      }

      // Send Existing Images (Edit Mode Preservation)
      // This requires your backend to handle an "existingImages" field to merge with new uploads
      if (isEdit && existingImageUrls.length > 0) {
        dataToSend.append("existingImages", JSON.stringify(existingImageUrls));
      } else if (isEdit && existingImageUrls.length === 0 && formData.images.length === 0) {
         // If edit mode and user deleted ALL images, explicitly send empty array to clear them
         dataToSend.append("existingImages", JSON.stringify([]));
      }

      if (isEdit) {
        await updateBlog(initialData._id, dataToSend);
      } else {
        await createBlog(dataToSend);
      }

      setSuccess(true);
      setTimeout(() => { onClose?.(); setSuccess(false); }, 1200);
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err?.response?.data?.message || err?.response?.data?.error || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-slate-900 to-slate-800">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                {isEdit ? <><Edit3 size={20} /> Edit Post</> : <><Plus size={20} /> New Post</>}
              </h2>
              <p className="mt-1 text-xs text-slate-400">{isEdit ? "Update content" : "Share your story"}</p>
            </div>
            <button onClick={onClose} className="p-2 text-white rounded-full bg-white/10 hover:bg-white/20"><X size={20} /></button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {error && <div className="p-3 mb-4 text-red-600 border border-red-200 rounded bg-red-50"><span>⚠️</span> {error}</div>}
            {success && <div className="p-3 mb-4 text-green-600 border border-green-200 rounded bg-green-50"><CheckCircle2 size={16} /> Saved successfully!</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-xs font-bold text-gray-500 uppercase">Title</label>
                  <input className="w-full p-3 border rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-indigo-500" type="text" name="title" placeholder="Title..." value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-2 text-xs font-bold text-gray-500 uppercase">Category</label>
                  <div className="relative">
                    <select 
                        className="relative z-50 w-full p-3 border rounded-lg outline-none appearance-none cursor-pointer bg-gray-50" 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        required
                    >
                      <option value="" disabled>Select…</option>
                      {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                    </select>
                    <span className="absolute z-10 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2"><ChevronDown size={18} /></span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs font-bold text-gray-500 uppercase">Images & SEO Alt Text</label>
                <ImageUploader value={formData.images} onChange={(val) => setFormData((p) => ({ ...p, images: val }))} />
              </div>

              <div>
                <label className="block mb-2 text-xs font-bold text-gray-500 uppercase">Content</label>
                <RichTextEditor value={formData.description} onChange={(html) => setFormData((p) => ({ ...p, description: html }))} />
              </div>
              <button type="submit" className="hidden" id="form-submit"></button>
            </form>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <button type="button" className="px-5 py-2.5 rounded-lg border text-gray-600 font-semibold hover:bg-gray-100 text-sm" onClick={onClose}>Cancel</button>
            <button type="button" className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg disabled:opacity-50 flex items-center gap-2 text-sm" onClick={() => document.getElementById('form-submit').click()} disabled={loading || success}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : success ? <><CheckCircle2 size={18} /> Saved!</> : (isEdit ? "Save Changes" : "Publish Post")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}