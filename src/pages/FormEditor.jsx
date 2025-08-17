import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FormEditor = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`https://dynamic-form-backend-gumc.onrender.com/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Error loading form:", err));
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://dynamic-form-backend-gumc.onrender.com/api/forms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Form updated!");
    } catch (err) {
      alert("❌ Error updating form: " + err.message);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Form: {form.title}</h2>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <button onClick={handleUpdate}>💾 Save Changes</button>
    </div>
  );
};

export default FormEditor;