import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dynamic-form-backend-gumc.onrender.com/api/forms")
      .then((res) => res.json())
      .then((data) => setForms(data))
      .catch((err) => console.error("Error fetching forms:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://dynamic-form-backend-gumc.onrender.com/api/forms/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForms((prev) => prev.filter((form) => form._id !== id));
    } catch (err) {
      alert("Error deleting form: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Saved Forms</h2>
      <ul>
        {forms.map((form) => (
          <li key={form._id}>
            <strong>{form.title}</strong> — {form.owner}
            <button onClick={() => navigate(`/edit/${form._id}`)}>✏️ Edit</button>
            <button onClick={() => navigate(`/form/${form._id}`)}>📄 View</button>
            <button onClick={() => handleDelete(form._id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormsList;