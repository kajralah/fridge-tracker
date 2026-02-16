import { useState, useEffect } from "react";
import { fetchCategories, insertRecipe, uploadImage, getImagePublicUrl } from './api/recipes';
import { resizeImage } from './helpers/imageHelper';

export default function CreateRecipeDialog({ isOpen, onClose, onRecipeCreated }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    cook_time: "",
    instructions: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCat = async () => {
    const { data } = await fetchCategories();
    setCategories(data || []);
  };
    fetchCat();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (form.image) {
        const fileName = `${Date.now()}-${form.image.name}`;
        const { error: uploadError } = await uploadImage(fileName, form.image);

        if (uploadError) throw uploadError;

        const { data } = getImagePublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const { data, error } = insertRecipe(form, imageUrl);

      if (error) throw error;

      if (onRecipeCreated) onRecipeCreated(data);

      setForm({ name: "", category_id: "", cook_time: "", instructions: "", image: null });
      onClose();
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, width: 400 }}>
        <h2>Create Recipe</h2>
        <form onSubmit={handleSubmit}>

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Category:</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10 }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <label>Cook Time (minutes):</label>
          <input
            type="number"
            name="cook_time"
            value={form.cook_time}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Instructions:</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            required
            rows={4}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Image:</label>
          <input type="file" name="image" accept="image/*"   onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              try {
                const resized = await resizeImage(e.target.files[0], 800, 800, 0.7);
                setForm((prev) => ({ ...prev, image: resized }));
              } catch (err) {
                console.error("Image resize failed:", err);
              }
            }
          }}/>

          <div style={{ marginTop: 15, display: "flex", justifyContent: "space-between" }}>
            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
