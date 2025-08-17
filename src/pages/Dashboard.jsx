import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("👤 Stored user from localStorage:", storedUser);
    setUser(storedUser);

    const fetchForms = async () => {
      try {
        const res = await fetch("https://dynamic-form-backend-gumc.onrender.com/api/forms");
        const data = await res.json();
        setForms(data);
      } catch (err) {
        console.error("❌ Error fetching forms:", err);
      }
    };

    fetchForms();
  }, []);

  const handleAddField = () => {
    setFields([...fields, { label: "", type: "short_text", required: true }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      alert("Form title is required.");
      return;
    }
    if (fields.length === 0) {
      alert("Add at least one field.");
      return;
    }

    const enrichedFields = fields.map((field, index) => ({
      ...field,
      key: `field_${index + 1}`,
    }));

    const payload = {
      title: formTitle,
      owner: user?.username || user?.email || "anonymous",
      fields: enrichedFields,
      airtable: {
        baseId: "appzeK1XXF3msG3aS",
        tableName: "Submissions",
      },
      showWhenOperator: "all",
      showWhen: [],
    };

    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch("https://dynamic-form-backend-gumc.onrender.com/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Response status:", res.status);
      console.log("📦 Response body:", data);

      if (res.status === 201) {
        alert("✅ Form saved and synced to Airtable!");
        setFormTitle("");
        setFields([]);
        setForms((prev) => [data.form, ...prev]);
      } else {
        alert("❌ Save failed. See console.");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("❌ Error saving form.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🛠️ Create New Form</h2>

      <div className="mb-3">
        <label className="form-label">Form Title</label>
        <input
          type="text"
          className="form-control"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Enter form title"
        />
      </div>

      <h4 className="mt-4">Fields</h4>
      {fields.map((field, index) => (
        <div key={index} className="card p-3 mb-3">
          <div className="mb-2">
            <label className="form-label">Label</label>
            <input
              type="text"
              className="form-control"
              value={field.label}
              onChange={(e) => handleFieldChange(index, "label", e.target.value)}
              placeholder="Field label"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={field.type}
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
            >
              <option value="short_text">Short Text</option>
              <option value="long_text">Long Text</option>
              <option value="single_select">Single Select</option>
              <option value="multi_select">Multi Select</option>
              <option value="attachment">Attachment</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={field.required}
              onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
            />
            <label className="form-check-label">Required</label>
          </div>
        </div>
      ))}

      <button className="btn btn-secondary me-2" onClick={handleAddField}>
        ➕ Add Field
      </button>
      <button className="btn btn-primary" onClick={handleSaveForm}>
        💾 Save Form
      </button>

      <hr className="my-5" />
      <h3>👀 Live Preview</h3>
      {fields.length === 0 ? (
        <p className="text-muted">No fields to preview yet.</p>
      ) : (
        <form>
          {fields.map((field, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">
                {field.label || `Untitled Field ${index + 1}`}
                {field.required && <span className="text-danger ms-1">*</span>}
              </label>

              {field.type === "short_text" && (
                <input type="text" className="form-control" disabled placeholder="Short text input" />
              )}
              {field.type === "long_text" && (
                <textarea className="form-control" disabled placeholder="Long text input" />
              )}
              {field.type === "single_select" && (
                <select className="form-select" disabled>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              )}
              {field.type === "multi_select" && (
                <select className="form-select" multiple disabled>
                  <option>Option A</option>
                  <option>Option B</option>
                </select>
              )}
              {field.type === "attachment" && (
                <input type="file" className="form-control" disabled />
              )}
            </div>
          ))}
        </form>
      )}

      <hr className="my-5" />
      <h3>📋 Your Saved Forms</h3>
      {forms.length === 0 ? (
        <p className="text-muted">No forms saved yet.</p>
      ) : (
        <ul className="list-group">
          {forms.map((form) => (
            <li key={form._id} className="list-group-item">
              <strong>{form.title}</strong> — {form.fields.length} fields
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;