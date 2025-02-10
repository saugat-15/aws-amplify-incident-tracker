import { useState, useCallback } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { validateServiceRequestWithoutId } from "../../../amplify/validators/ServiceRequestValidator";
import { Snackbar, CircularProgress, Alert } from "@mui/material"; // MUI imports
import ListServiceRequests from "./ListServiceRequests";
import { useNavigate } from "react-router-dom";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false); // State for success notification
  const navigate = useNavigate();

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
    setLoading(true);
    setError(null);
    setSuccess(false); // Reset success state before submitting
    try {
      console.log("Submitting request:", formData);
      const validatedData = validateServiceRequestWithoutId({
        ...formData,
        resolutionDate: new Date(formData.resolutionDate).toISOString(),
      });
      console.log("Validated data:", validatedData);

      if (!validatedData.data) {
        throw new Error("Invalid form data");
      }
      const response = await client.mutations.createRequest(validatedData.data);
      console.log("Request submitted successfully:", response);
      setSuccess(true); // Set success state after successful submission
    } catch (error) {
      console.error("Error submitting request:", error);
      setError("An error occurred while submitting the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`relative mx-auto p-6 bg-[#2C3930] shadow-2xl rounded-2xl ${
          loading ? "bg-black opacity-80 transition-opacity duration-300" : ""
        } md:max-w-7xl sm:max-w-6xl xs:max-w-full m-4`}
      >
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center mb-4">
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                color: "#A27B5C",
              }}
            />
          </div>
        )}

        {/* Form */}
        <>
          <h2 className="text-xl font-bold mb-4 text-[#DCD7C9]">
            Service Request Form
          </h2>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full cursor-pointer bg-[#A27B5C] text-[#DCD7C9] px-4 py-2 rounded-full hover:opacity-75 transition duration-300 font-medium text-sm"
            >
              Back to Service Request List
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="gap-4 grid grid-cols-1 md:grid-cols-2"
          >
            {/* Request Details Section */}
            <div className=" p-4 rounded-lg bg-[#3F4F44]">
              <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
                Request Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Service Name*"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <SelectField
                  label="Severity*"
                  name="severity"
                  value={formData.severity || ""}
                  onChange={handleChange}
                  options={["LOW", "MEDIUM", "HIGH"]}
                  disabled={loading}
                />
                <TextAreaField
                  label="Description*"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="p-4 rounded-lg bg-[#3F4F44]">
              <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Reporter Name*"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <InputField
                  label="Contact Email*"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <InputField
                  label="Location*"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Timeline Section */}
            <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
              <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
                Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Resolution Date"
                  name="resolutionDate"
                  type="datetime-local"
                  value={formData.resolutionDate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full cursor-pointer bg-[#A27B5C] text-[#DCD7C9] px-4 py-2 rounded-full hover:opacity-75 transition duration-300 font-medium text-sm"
              >
                Submit Request
              </button>
            </div>
          </form>
        </>

        {/* Snackbar for success or error */}
        <Snackbar
          open={!!error || success}
          autoHideDuration={5000} // Set the duration to 5 seconds
          onClose={() => {
            setError(null);
            setSuccess(false);
          }}
        >
          <Alert
            onClose={() => {
              setError(null);
              setSuccess(false);
            }}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || "Request submitted successfully!"}
          </Alert>
        </Snackbar>
      </div>

      <ListServiceRequests />
    </>
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
  disabled,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label className="block text-xs font-medium text-[#DCD7C9] mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md text-sm"
      required={required}
      disabled={disabled}
    />
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}> = ({ label, disabled, name, value, onChange, required = false }) => (
  <div className="md:col-span-2">
    <label className="block text-xs font-medium text-[#DCD7C9] mb-1">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md text-sm"
      rows={3}
      required={required}
      disabled={disabled}
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  options: string[];
}> = ({ label, name, value, disabled, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium text-[#DCD7C9] mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md text-sm"
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
