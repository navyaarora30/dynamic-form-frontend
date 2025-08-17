const FormRenderer = ({ form }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>{form.title}</h2>
      {form.fields.map((field, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <label>{field.label}</label>
          {field.type === "short_text" && <input type="text" />}
          {field.type === "long_text" && <textarea />}
          {field.type === "single_select" && (
            <select>
              {field.options.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          )}
          {field.type === "multi_select" && (
            <div>
              {field.options.map((opt, i) => (
                <label key={i}>
                  <input type="checkbox" value={opt} /> {opt}
                </label>
              ))}
            </div>
          )}
          {field.type === "attachment" && <input type="file" />}
        </div>
      ))}
    </div>
  );
};

export default FormRenderer;