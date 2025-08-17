import { useState } from "react";

export default function CreateForm() {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([
      ...fields,
      {
        label: "",
        type: "Short Text",
        required: false
      }
    ]);
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const mapType = (type) => {
    switch (type) {
      case "Short Text":
        return "short_text";
      case "Long Text":
        return "long_text";
      case "Email":
        return "short_text"; 
      case "Number":
        return "short_text"; // Or use "number" if supported
      default:
        return "short_text";
    }
  };

  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      alert("Form title is required.");
      return;
    }
    if (fields.length === 0) {
      alert("Please add at least one field.");
      return;
    }

    const payload = {
      title: formTitle,
      owner: "navya", // Replace with actual user ID/email if needed
      fields: fields.map((field, index) => ({
        key: `field_${index}`,
        label: field.label || `Field ${index + 1}`,
        type: mapType(field.type),
        required: !!field.required,
        airtableFieldId: "",
        airtableFieldName: "",
        options: [],
        showWhenOperator: "all",
        showWhen: []
      }))
    };

    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch("https://dynamic-form-backend-gumc.onrender.com/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("📥 Response status:", res.status);

      if (res.ok) {
        alert("Form saved!");
        setFormTitle("");
        setFields([]);
      } else {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
        alert("Failed to save form.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Error saving form.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create New Form</h2>
      <input
        type="text"
        placeholder="Form title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
      />

      <h4>Fields</h4>
      {fields.map((field, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px"
          }}
        >
          <input
            type="text"
            placeholder="Label"
            value={field.label}
            onChange={(e) => updateField(index, "label", e.target.value)}
            style={{ marginRight: "10px", padding: "6px" }}
          />
          <select
            value={field.type}
            onChange={(e) => updateField(index, "type", e.target.value)}
            style={{ marginRight: "10px", padding: "6px" }}
          >
            <option value="Short Text">Short Text</option>
            <option value="Long Text">Long Text</option>
            <option value="Email">Email</option>
            <option value="Number">Number</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(index, "required", e.target.checked)}
              style={{ marginRight: "5px" }}
            />
            Required
          </label>
          <button onClick={() => removeField(index)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      ))}

      <button onClick={addField} style={{ marginBottom: "20px" }}>
        Add Field
      </button>
      <br />
      <button onClick={handleSaveForm}>Save Form</button>
    </div>
  );
}