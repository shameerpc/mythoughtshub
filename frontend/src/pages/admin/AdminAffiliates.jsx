import { useEffect, useMemo, useState } from "react";
import { Edit, ExternalLink, Plus, Search, Trash2, X } from "lucide-react";
import {
  createAdminAffiliate,
  deleteAdminAffiliate,
  getAdminAffiliates,
  updateAdminAffiliate,
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
};

const toFormData = (form) => {
  const data = new FormData();
  ["name", "description", "price", "originalPrice", "discount", "rating", "affiliateLink", "category", "isFeatured"].forEach((key) => {
    data.append(key, form[key]);
  });
  data.append("existingMedia", JSON.stringify(form.media || []));
  Array.from(form.files || []).forEach((file) => data.append("media", file));
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

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    await deleteAdminAffiliate(product._id);
    setProducts((prev) => prev.filter((item) => item._id !== product._id));
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
