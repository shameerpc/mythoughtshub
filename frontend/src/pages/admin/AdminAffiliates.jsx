import { useEffect, useMemo, useState } from "react";
import { Edit, ExternalLink, Plus, Search, Trash2, X, Sparkles, ShieldCheck, TrendingUp, Share2, ImageIcon } from "lucide-react";
import {
  createAdminAffiliate,
  deleteAdminAffiliate,
  getAdminAffiliates,
  updateAdminAffiliate,
  generateAdminAffiliateSeo,
} from "../../api/admin.api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  discount: "",
  rating: 4,
  affiliateLink: "",
  category: "general",
  isFeatured: false,
  media: [],
  files: [],
  pinTitle: "",
  pinDescription: "",
  pinAltText: "",
  pinTags: "",
  pinImage: null,
  pinImageFile: null,
  ogTitle: "",
  ogDescription: "",
  ogImage: null,
  ogImageFile: null,
  socialSharing: {
    pinterest: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    whatsapp: "",
  },
  imageSeo: {
    filename: "",
    altText: "",
    title: "",
    caption: "",
  },
  seoScore: {
    pinterestScore: 0,
    ogScore: 0,
    imageScore: 0,
    overallScore: 0,
  },
  trendSuggestions: {
    keywords: [],
    tags: [],
    contentAngles: [],
  },
};

const toFormData = (form) => {
  const data = new FormData();
  ["name", "description", "price", "originalPrice", "discount", "rating", "affiliateLink", "category", "isFeatured", "pinTitle", "pinDescription", "pinAltText", "pinTags", "ogTitle", "ogDescription"].forEach((key) => {
    const val = form[key];
    data.append(key, val === null || val === undefined ? "" : val);
  });
  data.append("existingMedia", JSON.stringify(form.media || []));
  Array.from(form.files || []).forEach((file) => data.append("media", file));

  if (form.pinImageFile) {
    data.append("pinImage", form.pinImageFile);
  } else if (form.pinImage) {
    data.append("existingPinImage", JSON.stringify(form.pinImage));
  } else {
    data.append("existingPinImage", "");
  }

  if (form.ogImageFile) {
    data.append("ogImage", form.ogImageFile);
  } else if (form.ogImage) {
    data.append("existingOgImage", JSON.stringify(form.ogImage));
  } else {
    data.append("existingOgImage", "");
  }

  // Append AI generated/optimized SEO subdocuments
  data.append("socialSharing", JSON.stringify(form.socialSharing || {}));
  data.append("imageSeo", JSON.stringify(form.imageSeo || {}));
  data.append("seoScore", JSON.stringify(form.seoScore || {}));
  data.append("trendSuggestions", JSON.stringify(form.trendSuggestions || {}));

  return data;
};

const AdminAffiliates = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminAffiliates();
      setProducts(response.result || response.response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load affiliate products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((product) => product.name?.toLowerCase().includes(q) || product.category?.toLowerCase().includes(q));
  }, [products, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      ...emptyForm,
      ...product,
      media: product.media || [],
      files: [],
      pinTags: Array.isArray(product.pinTags) ? product.pinTags.join(", ") : product.pinTags || "",
      pinImageFile: null,
      ogImageFile: null,
      socialSharing: product.socialSharing || emptyForm.socialSharing,
      imageSeo: product.imageSeo || emptyForm.imageSeo,
      seoScore: product.seoScore || emptyForm.seoScore,
      trendSuggestions: product.trendSuggestions || emptyForm.trendSuggestions,
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const response = await updateAdminAffiliate(editing._id, toFormData(form));
        setProducts((prev) => prev.map((item) => item._id === editing._id ? response.result : item));
      } else {
        const response = await createAdminAffiliate(toFormData(form));
        setProducts((prev) => [response.result, ...prev]);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const [generatingSeo, setGeneratingSeo] = useState(false);

  const handleGenerateSeo = async () => {
    if (!form.name || !form.description) {
      setError("Please enter the product Name and Description before generating SEO suggestions.");
      return;
    }
    setGeneratingSeo(true);
    setError("");
    try {
      const response = await generateAdminAffiliateSeo({
        name: form.name,
        description: form.description,
        category: form.category,
      });
      const data = response.result;

      setForm((prev) => ({
        ...prev,
        pinTitle: data.pinTitle || prev.pinTitle,
        pinDescription: data.pinDescription || prev.pinDescription,
        pinAltText: data.pinAltText || prev.pinAltText,
        pinTags: Array.isArray(data.pinTags) ? data.pinTags.join(", ") : (data.pinTags || prev.pinTags),
        ogTitle: data.ogTitle || prev.ogTitle,
        ogDescription: data.ogDescription || prev.ogDescription,
        socialSharing: data.socialSharing || prev.socialSharing,
        imageSeo: data.imageSeo || prev.imageSeo,
        seoScore: data.seoScore || prev.seoScore,
        trendSuggestions: data.trendSuggestions || prev.trendSuggestions,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate AI SEO content.");
    } finally {
      setGeneratingSeo(false);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError("");
    try {
      await deleteAdminAffiliate(product._id);
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const removeMedia = (index) => {
    setForm((prev) => ({ ...prev, media: prev.media.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Affiliate Products</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage product recommendations.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="h-10 rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white" onClick={openCreate}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {showForm && (
        <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">{editing ? "Edit product" : "Add product"}</h2>
            <button type="button" className="text-slate-400 hover:text-slate-700" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Original price" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Discount" value={form.discount || ""} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Affiliate URL" value={form.affiliateLink} onChange={(e) => setForm({ ...form, affiliateLink: e.target.value })} required />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="1" max="5" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            <textarea className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2 xl:col-span-4" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={!!form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured product
            </label>
            <input className="text-sm md:col-span-2" type="file" multiple accept="image/*,video/*" onChange={(e) => setForm({ ...form, files: e.target.files })} />

            {/* Pinterest & Open Graph SEO Section */}
            <div className="md:col-span-2 xl:col-span-4 border-t border-slate-200 pt-6 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="text-indigo-600 animate-pulse" size={18} />
                  Pinterest & Social SEO Engine
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Automate Pinterest board keywords, rich pin titles, filenames, and multi-channel sharing templates.</p>
              </div>
              <button 
                type="button" 
                onClick={handleGenerateSeo}
                disabled={generatingSeo}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Sparkles size={14} />
                {generatingSeo ? "Generating AI Metadata..." : "Generate AI SEO"}
              </button>
            </div>

            {/* AI SEO SCORES (if generated) */}
            {form.seoScore && form.seoScore.overallScore > 0 && (
              <div className="md:col-span-2 xl:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-inner">
                <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Overall SEO</span>
                  <div className="mt-2 text-2xl font-black text-indigo-400">{form.seoScore.overallScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 max-w-[80px] overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${form.seoScore.overallScore}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pinterest Score</span>
                  <div className="mt-2 text-2xl font-black text-emerald-400">{form.seoScore.pinterestScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 max-w-[80px] overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${form.seoScore.pinterestScore}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Social Sharing</span>
                  <div className="mt-2 text-2xl font-black text-amber-400">{form.seoScore.ogScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 max-w-[80px] overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${form.seoScore.ogScore}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Image Alt/SEO</span>
                  <div className="mt-2 text-2xl font-black text-cyan-400">{form.seoScore.imageScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 max-w-[80px] overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${form.seoScore.imageScore}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Pinterest settings card */}
            <div className="md:col-span-2 xl:col-span-2 space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp size={14} /> Pinterest SEO Data
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pin Title (50-100 chars)</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700" placeholder="e.g. 10 Must-Have Laptop Accessories for Productivity" maxLength={100} value={form.pinTitle} onChange={(e) => setForm({ ...form, pinTitle: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pin Description (200-500 chars)</label>
                  <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700" rows="3" placeholder="Keyword-rich Pinterest description with CTA" maxLength={500} value={form.pinDescription} onChange={(e) => setForm({ ...form, pinDescription: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pinterest Accessibility Alt Text</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700" placeholder="Describe the image context for search visibility" value={form.pinAltText} onChange={(e) => setForm({ ...form, pinAltText: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Keywords / Tags (comma-separated)</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700" placeholder="TechTips, DeskSetup, HomeOffice" value={form.pinTags} onChange={(e) => setForm({ ...form, pinTags: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2.5 pt-4 border-t border-slate-200/60">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pinterest Custom Sharing Image</label>
                <input className="text-sm w-full cursor-pointer" type="file" accept="image/*" onChange={(e) => setForm({ ...form, pinImageFile: e.target.files[0] })} />
                {form.pinImage && !form.pinImageFile && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white mt-1 group">
                    <img src={form.pinImage.url} alt="Pinterest Preview" className="h-full w-full object-cover" />
                    <button type="button" className="absolute right-0.5 top-0.5 rounded-full bg-slate-900/60 p-0.5 text-white shadow hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100" onClick={() => setForm({ ...form, pinImage: null })}><X size={10} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media & Open Graph settings card */}
            <div className="md:col-span-2 xl:col-span-2 space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Share2 size={14} /> Open Graph Social Data
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Graph Title</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700" placeholder="OG sharing title (Facebook / X preview)" value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Graph Description</label>
                  <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700" rows="3" placeholder="Summary shared on chat cards & feeds" value={form.ogDescription} onChange={(e) => setForm({ ...form, ogDescription: e.target.value })} />
                </div>

                {/* AI Trend Suggestions Preview */}
                {form.trendSuggestions && form.trendSuggestions.contentAngles?.length > 0 && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 mt-2">
                    <h5 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">AI Content Angles & Trends</h5>
                    <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                      {form.trendSuggestions.contentAngles.slice(0, 3).map((angle, i) => (
                        <li key={i} className="font-medium">{angle}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-2.5 pt-4 border-t border-slate-200/60">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">OG Preview Sharing Image</label>
                <input className="text-sm w-full cursor-pointer" type="file" accept="image/*" onChange={(e) => setForm({ ...form, ogImageFile: e.target.files[0] })} />
                {form.ogImage && !form.ogImageFile && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white mt-1 group">
                    <img src={form.ogImage.url} alt="OG Preview" className="h-full w-full object-cover" />
                    <button type="button" className="absolute right-0.5 top-0.5 rounded-full bg-slate-900/60 p-0.5 text-white shadow hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100" onClick={() => setForm({ ...form, ogImage: null })}><X size={10} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Image SEO block (100% width) */}
            <div className="md:col-span-2 xl:col-span-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon size={14} /> Image Asset SEO Tuning
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Filename (lowercase, hyphenated)</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500 font-mono text-slate-600" value={form.imageSeo?.filename || ""} onChange={(e) => setForm({ ...form, imageSeo: { ...form.imageSeo, filename: e.target.value } })} placeholder="e.g. ugreen-hub-seo.jpg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image ALT Text</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500 text-slate-600" value={form.imageSeo?.altText || ""} onChange={(e) => setForm({ ...form, imageSeo: { ...form.imageSeo, altText: e.target.value } })} placeholder="Detailed image context description" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image Title</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500 text-slate-600" value={form.imageSeo?.title || ""} onChange={(e) => setForm({ ...form, imageSeo: { ...form.imageSeo, title: e.target.value } })} placeholder="SEO-friendly image tag title" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Image Caption</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500 text-slate-600" value={form.imageSeo?.caption || ""} onChange={(e) => setForm({ ...form, imageSeo: { ...form.imageSeo, caption: e.target.value } })} placeholder="Short visual legend text" />
                </div>
              </div>
            </div>

            {/* Custom Social Sharing content card (100% width) */}
            <div className="md:col-span-2 xl:col-span-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                <Share2 size={14} /> Custom Social Share Scripts (Editable)
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">WhatsApp Text</label>
                  <textarea rows="4" className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-indigo-500 mt-1.5 resize-none text-slate-600" value={form.socialSharing?.whatsapp || ""} onChange={(e) => setForm({ ...form, socialSharing: { ...form.socialSharing, whatsapp: e.target.value } })} />
                </div>
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Facebook Script</label>
                  <textarea rows="4" className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-indigo-500 mt-1.5 resize-none text-slate-600" value={form.socialSharing?.facebook || ""} onChange={(e) => setForm({ ...form, socialSharing: { ...form.socialSharing, facebook: e.target.value } })} />
                </div>
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">LinkedIn Update</label>
                  <textarea rows="4" className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-indigo-500 mt-1.5 resize-none text-slate-600" value={form.socialSharing?.linkedin || ""} onChange={(e) => setForm({ ...form, socialSharing: { ...form.socialSharing, linkedin: e.target.value } })} />
                </div>
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">X (Twitter) Tweet</label>
                  <textarea rows="4" className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-indigo-500 mt-1.5 resize-none text-slate-600" value={form.socialSharing?.twitter || ""} onChange={(e) => setForm({ ...form, socialSharing: { ...form.socialSharing, twitter: e.target.value } })} />
                </div>
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pinterest Pin Caption</label>
                  <textarea rows="4" className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-indigo-500 mt-1.5 resize-none text-slate-600" value={form.socialSharing?.pinterest || ""} onChange={(e) => setForm({ ...form, socialSharing: { ...form.socialSharing, pinterest: e.target.value } })} />
                </div>
              </div>
            </div>
          </div>
          {form.media?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {form.media.map((item, index) => (
                <div key={item.public_id || item.url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {item.type === "video" ? <video src={item.url} className="h-full w-full object-cover" /> : <img src={item.url} alt="" className="h-full w-full object-cover" />}
                  <button type="button" className="absolute right-1 top-1 rounded-full bg-white p-1 text-red-600 shadow" onClick={() => removeMedia(index)}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={saving}>{saving ? "Saving..." : "Save Product"}</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-200" />)
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">No affiliate products found.</div>
        ) : filtered.map((product) => {
          const media = product.media?.[0];
          return (
            <article key={product._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="h-44 bg-slate-100">
                {media ? (media.type === "video" ? <video src={media.url} className="h-full w-full object-cover" /> : <img src={media.url} alt={product.name} className="h-full w-full object-cover" />) : null}
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-slate-900">{product.name}</h2>
                  {product.isFeatured && <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">Featured</span>}
                </div>
                <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-bold text-indigo-600">{product.price}</span>
                  <span className="text-slate-500">{product.category}</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                  <a className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-indigo-600" href={product.affiliateLink} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Link</a>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" onClick={() => openEdit(product)}><Edit size={16} /></button>
                    <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" onClick={() => remove(product)}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AdminAffiliates;
