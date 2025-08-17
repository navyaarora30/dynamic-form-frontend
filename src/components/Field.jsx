export default function Field({ field, value, onChange }) {
  const handleInput = (e) => onChange(field.key, e.target.value);

  const handleCheckbox = (option) => {
    const current = value || [];
    const updated = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option];
    onChange(field.key, updated);
  };

  switch (field.type) {
    case "short_text":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <input
            type="text"
            className="form-control"
            value={value || ""}
            onChange={handleInput}
            required={field.required}
          />
        </div>
      );

    case "long_text":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <textarea
            className="form-control"
            rows="4"
            value={value || ""}
            onChange={handleInput}
            required={field.required}
          />
        </div>
      );

    case "single_select":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <select
            className="form-select"
            value={value || ""}
            onChange={handleInput}
            required={field.required}
          >
            <option value="">Select</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "multi_select":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          {field.options.map((opt) => (
            <div className="form-check" key={opt}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={value?.includes(opt)}
                onChange={() => handleCheckbox(opt)}
              />
              <label className="form-check-label">{opt}</label>
            </div>
          ))}
        </div>
      );

    case "attachment":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => onChange(field.key, e.target.files[0])}
            required={field.required}
          />
        </div>
      );

    default:
      return null;
  }
}