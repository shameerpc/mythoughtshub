import { useState } from "react";
import { ExternalLink, Trash2, Plus, Copy } from "lucide-react";

const AdminAffiliates = () => {
  const [links, setLinks] = useState([
    { id: 1, product: "HostGator Hosting", url: "https://hostgator.com/ref=alex", commission: "30%", clicks: 120 },
    { id: 2, product: "SEMrush", url: "https://semrush.com/ref=alex", commission: "$40/sale", clicks: 85 },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setLinks([...links, {
      id: Date.now(),
      product: e.target.product.value,
      url: e.target.url.value,
      commission: e.target.commission.value,
      clicks: 0
    }]);
    setShowForm(false);
    e.target.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Affiliate Management</h1>
        <button className="btn btn-primary gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4"/> Add Link
        </button>
      </div>

      {/* Inline Add Form */}
      {showForm && (
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="form-control">
                <label className="label label-text">Product Name</label>
                <input name="product" type="text" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label label-text">Referral URL</label>
                <input name="url" type="url" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label label-text">Commission</label>
                <input name="commission" type="text" placeholder="e.g. 20%" className="input input-bordered" required />
              </div>
              <button className="btn btn-primary">Save Link</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map(link => (
          <div key={link.id} className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h2 className="card-title justify-between">
                {link.product}
                <div className="badge badge-outline">{link.commission}</div>
              </h2>
              <p className="text-sm text-gray-500 truncate font-mono bg-base-200 p-2 rounded mt-2">
                <ExternalLink className="inline w-3 h-3 mr-1"/> {link.url}
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm font-bold">Total Clicks: {link.clicks}</div>
                <div className="join">
                  <button className="btn btn-sm btn-ghost join-item" title="Copy"><Copy className="w-4 h-4"/></button>
                  <button className="btn btn-sm btn-error btn-ghost join-item" onClick={() => handleDelete(link.id)}><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAffiliates;