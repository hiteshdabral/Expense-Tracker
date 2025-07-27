import React, { useState } from "react";
import { FormConfig, FormField } from "@/types/form";

const Form: React.FC<FormConfig> = ({
  fields,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || "",
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      ) => handleChange(field.name, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className:
        "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:blue-500",
    };

   switch (field.type) {
    case 'select':
      return (
        <select
          id={field.name}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required={field.required}
          className={commonProps.className}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case 'textarea':
      return <textarea {...commonProps} />;
    default:
      return <input type={field.type} {...commonProps} />;
  }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="block test-sm font-medium">
            {field.label}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus-outline-none focus:ring-2 focus:ring-blue-500"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;
