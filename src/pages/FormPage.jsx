import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormRenderer from "../components/FormRenderer";

export default function FormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`https://dynamic-form-backend-gumc.onrender.com/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Error loading form:", err));
  }, [id]);

  return (
    <div>
      {form ? (
        <FormRenderer form={form} />
      ) : (
        <div className="text-center mt-5">
          <div className="spinner-border" />
        </div>
      )}
    </div>
  );
}