import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

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

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name").order("name");
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      let { width, height } = img;

      // Calculate new size keeping aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      // Draw to canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        },
        file.type,
        quality
      );
    };

    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
};  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      // Upload image if exists
      if (form.image) {
          const fileName = `${Date.now()}-${form.image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(fileName, form.image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("recipe-images")
          .getPublicUrl(fileName);
            imageUrl = data.publicUrl;

                  console.log(imageUrl)

      }


      // Insert recipe
      const { data, error } = await supabase.from("recipes").insert({
        name: form.name,
        category_id: form.category_id,
        cook_time: form.cook_time,
        instructions: form.instructions,
        image_url: imageUrl,
      }).select().single();

      if (error) throw error;

      // Callback to parent
      if (onRecipeCreated) onRecipeCreated(data);

      // Reset form and close dialog
      setForm({ name: "", category_id: "", cook_time: "", instructions: "", image: null });
      onClose();
    } catch (err) {
      console.error("Error creating recipe:", err.message);
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
