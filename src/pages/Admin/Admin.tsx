import { useState, useRef, useEffect } from "react";
import { saveProduct, getProducts, deleteProduct } from "../../utils/productStorage";
import type { Product } from "../../types/product";
import { supabase } from "../../lib/supabase";
import { Upload, X, Trash2, Star, Users, Package, List } from "lucide-react";
import "./Admin.css";

interface RegisteredUser {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
}

const Admin = () => {
    const [activeTab, setActiveTab] = useState<"products" | "listed" | "users">("products");

    // --- Products State ---
    const [formData, setFormData] = useState<Product>({
        id: "",
        name: "",
        description: "",
        price: 0,
        discountPercentage: 0,
        rating: 0,
        image: ""
    });
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Users State ---
    const [users, setUsers] = useState<RegisteredUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const refreshProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (data && !error) {
                setUsers(data.map(u => ({
                    id: u.id,
                    email: u.email ?? "No email",
                    created_at: u.created_at,
                    last_sign_in_at: u.last_sign_in_at ?? null,
                })));
            } else {
                console.error("Error fetching users:", error?.message);
            }
        } catch (err) {
            console.error("Unexpected error fetching users:", err);
        }
        setUsersLoading(false);
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    useEffect(() => {
        if (activeTab === "listed") {
            refreshProducts();
        }
        if (activeTab === "users") {
            fetchUsers();
        }
    }, [activeTab]);

    // --- Product Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file (PNG, JPG, WEBP, etc.)");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setImagePreview(base64);
            setFormData(prev => ({ ...prev, image: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };
    const removeImage = () => {
        setImagePreview("");
        setFormData(prev => ({ ...prev, image: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) { alert("Please add a product image."); return; }

        const newProduct: Product = {
            ...formData,
            id: Date.now().toString(),
            price: Number(formData.price),
            discountPercentage: Number(formData.discountPercentage),
            rating: Number(formData.rating)
        };

        try {
            await saveProduct(newProduct);
            alert("Product added successfully!");
            setFormData({ id: "", name: "", description: "", price: 0, discountPercentage: 0, rating: 0, image: "" });
            setImagePreview("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            refreshProducts();
        } catch (err) {
            alert("Failed to add product. Check console for details.");
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
            refreshProducts();
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Admin Dashboard</h2>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === "products" ? "admin-tab--active" : ""}`}
                    onClick={() => setActiveTab("products")}
                >
                    <Package size={18} /> Add Product
                </button>
                <button
                    className={`admin-tab ${activeTab === "listed" ? "admin-tab--active" : ""}`}
                    onClick={() => setActiveTab("listed")}
                >
                    <List size={18} /> Listed Products
                </button>
                <button
                    className={`admin-tab ${activeTab === "users" ? "admin-tab--active" : ""}`}
                    onClick={() => setActiveTab("users")}
                >
                    <Users size={18} /> Users
                </button>
            </div>

            {/* Products Tab */}
            {activeTab === "products" && (
                <>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Product Name</label>
                            <input id="name" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={4} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input id="price" name="price" type="number" placeholder="Price" value={formData.price || ""} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="discountPercentage">Discount %</label>
                                <input id="discountPercentage" name="discountPercentage" type="number" placeholder="Discount %" value={formData.discountPercentage || ""} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="rating">Rating (0 - 5)</label>
                            <input id="rating" name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating" value={formData.rating || ""} onChange={handleChange} />
                        </div>

                        {/* Drag & Drop Image */}
                        <div className="form-group">
                            <label>Product Image</label>
                            {imagePreview ? (
                                <div className="image-preview-wrapper">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button type="button" className="remove-image-btn" onClick={removeImage}><X size={18} /></button>
                                </div>
                            ) : (
                                <div
                                    className={`drop-zone ${isDragging ? "drop-zone--active" : ""}`}
                                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={32} strokeWidth={1.5} />
                                    <p className="drop-zone-text">Drag & drop an image here, or <span className="drop-zone-link">browse</span></p>
                                    <p className="drop-zone-hint">PNG, JPG, WEBP up to 5MB</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="drop-zone-input" onChange={handleFileSelect} />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="admin-submit-btn">Add Product</button>
                    </form>
                </>
            )}

            {/* Listed Products Tab */}
            {activeTab === "listed" && (
                <div className="admin-listed-section">
                    {products.length === 0 ? (
                        <p className="users-empty">No products listed yet.</p>
                    ) : (
                        <>
                            <h3 className="admin-list-title">All Products ({products.length})</h3>
                            {products.map(product => (
                                <div className="admin-product-item" key={product.id}>
                                    <div className="admin-product-thumb">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="admin-product-info">
                                        <h4 className="admin-product-name">{product.name}</h4>
                                        <div className="admin-product-meta">
                                            <span className="admin-product-price">${product.price}</span>
                                            {product.discountPercentage > 0 && (
                                                <span className="admin-product-discount">-{product.discountPercentage}%</span>
                                            )}
                                            <span className="admin-product-rating">
                                                <Star size={14} fill="#FFC633" color="#FFC633" /> {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="admin-delete-btn" onClick={() => handleDelete(product.id)} aria-label="Delete product">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
                <div className="admin-users-section">
                    {usersLoading ? (
                        <p className="users-loading">Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className="users-empty">No registered users found.</p>
                    ) : (
                        <>
                            <h3 className="admin-list-title">Registered Users ({users.length})</h3>
                            <div className="users-table-wrapper">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email</th>
                                            <th>Registered</th>
                                            <th>Last Login</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, index) => (
                                            <tr key={u.id}>
                                                <td>{index + 1}</td>
                                                <td className="user-email">{u.email}</td>
                                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                                <td>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
