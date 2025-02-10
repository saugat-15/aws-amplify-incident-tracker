import { useState, useCallback } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();
type Severity = Schema["ServiceRequest"]["type"]["severity"];

const getResolutionDate = (severity: Severity): string => {
  const now = new Date();
  const daysToAdd = severity === "HIGH" ? 1 : severity === "MEDIUM" ? 3 : 5;
  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString().slice(0, 16); // Format for datetime-local input
};

const ServiceRequestForm = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    severity: "LOW" as Severity,
    description: "",
    reporterName: "",
    contactEmail: "",
    location: "",
    resolutionDate: getResolutionDate("LOW"),
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        resolutionDate:
          name === "severity"
            ? getResolutionDate(value as Severity)
            : prevData.resolutionDate,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.mutations.createRequest({
        ...formData,
        resolutionDate: new Date(formData.resolutionDate).toISOString(),
      });
      console.log("Request submitted successfully:", response);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#2C3930] shadow-2xl rounded-2xl m-4">
      <h2 className="text-2xl font-bold mb-6 text-[#DCD7C9]">
        Service Request Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Request Details Section */}
        <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
          <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
            Request Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Service Name*"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
            <SelectField
              label="Severity*"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              options={["LOW", "MEDIUM", "HIGH"]}
            />
            <TextAreaField
              label="Description*"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
          <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Reporter Name*"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Contact Email*"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
            <InputField
              label="Location*"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
          <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
            Timeline
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="Resolution Date"
              name="resolutionDate"
              type="datetime-local"
              value={formData.resolutionDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full cursor-pointer bg-[#A27B5C] text-[#DCD7C9] px-6 py-3 rounded-full hover:opacity-75 transition duration-300 font-medium"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md"
      required={required}
      disabled={disabled}
    />
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}> = ({ label, name, value, onChange, required = false }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md"
      rows={3}
      required={required}
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}> = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md"
    >
      {options.map((option) => (
        <option key={option} value={option} className="text-black">
          {option.charAt(0) + option.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  </div>
);

export default ServiceRequestForm;
