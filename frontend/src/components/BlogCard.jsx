export default function BlogCard({ blog }) {
    const title = blog?.title || "No title";
    const description = blog?.description || "No description available";
  
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description.slice(0, 100)}...</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Read More</button>
          </div>
        </div>
      </div>
    );
  }
  
  