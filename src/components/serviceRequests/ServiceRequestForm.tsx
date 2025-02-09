import React from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();

const ServiceRequestForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await client.mutations.createRequest({
      serviceName: "Service Name",
      severity: "LOW",
      description: "Description",
      reporterName: "Reporter Name",
      contactEmail: "saugat@gmail.com",
      location: "Location",
      resolutionDate: new Date().toISOString(),
    });
    console.log(response);
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
        {/* Request Details Group */}
        <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
          <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
            Request Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Service Name*
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Severity*
              </label>
              <select className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Description*
              </label>
              <textarea
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Contact Information Group */}
        <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
          <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Reporter Name*
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Contact Email*
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Location*
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
              />
            </div>
          </div>
        </div>

        {/* Timeline Group */}
        <div className="md:col-span-2 p-4 rounded-lg bg-[#3F4F44]">
          <h3 className="text-lg font-semibold mb-4 text-[#DCD7C9]">
            Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Resolution Date
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#DCD7C9] mb-1">
                Timestamp
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 bg-[#e2fcd6] border-[#A27B5C] border rounded-md shadow-sm focus:ring-[#A27B5C] focus:border-[#A27B5C] text-[#2C3930]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#A27B5C] text-[#DCD7C9] px-6 py-3 rounded-full hover:opacity-75 cursor-pointer transition duration-300 font-medium"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
