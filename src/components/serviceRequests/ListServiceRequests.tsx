import React, { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();

const SeverityBadge: React.FC<{ severity: "HIGH" | "MEDIUM" | "LOW" }> = ({
  severity,
}) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
  const severityClasses = {
    HIGH: "bg-red-100 text-red-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    LOW: "bg-green-100 text-green-800",
  };

  return (
    <span className={`${baseClasses} ${severityClasses[severity]}`}>
      {severity}
    </span>
  );
};

const ServiceRequestDetails = ({
  request,
  formatDate,
}: {
  request: Schema["ServiceRequest"]["type"];
  formatDate: (dateString: string) => string;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-[#A27B5C]">Description</h4>
        <p className="text-[#DCD7C9]">{request.description}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-[#A27B5C]">Location</h4>
        <p className="text-[#DCD7C9]">{request.location}</p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-[#A27B5C]">
          Contact Information
        </h4>
        <p className="text-[#DCD7C9]">{request.reporterName}</p>
        <p className="text-[#DCD7C9]">{request.contactEmail}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-[#A27B5C]">Timeline</h4>
        <p className="text-[#DCD7C9]">
          Resolution Date: {formatDate(request?.resolutionDate || "")}
        </p>
      </div>
    </div>
  </div>
);

const ServiceRequestItem = ({
  request,
  formatDate,
}: {
  request: Schema["ServiceRequest"]["type"];
  formatDate: (dateString: string) => string;
}) => (
  <div
    key={request.id}
    className="bg-[#3F4F44] rounded-lg shadow-lg overflow-hidden"
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#DCD7C9]">
          {request.serviceName}
        </h3>
        <SeverityBadge severity={request.severity || "LOW"} />
      </div>
      <ServiceRequestDetails request={request} formatDate={formatDate} />
    </div>
    <div className="px-6 py-4 bg-[#2C3930] flex justify-end space-x-4">
      <button className="px-4 py-2 rounded-full bg-[#A27B5C] text-[#DCD7C9] hover:opacity-90 transition-opacity cursor-pointer">
        Update Status
      </button>
      <button className="px-4 py-2 rounded-full border border-[#A27B5C] text-[#DCD7C9] hover:bg-[#A27B5C] transition-colors cursor-pointer">
        View Details
      </button>
    </div>
  </div>
);

const ServiceRequestList = ({
  serviceRequests,
}: {
  serviceRequests: Schema["ServiceRequest"]["type"][];
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#DCD7C9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3930] mb-8">
          Service Requests
        </h2>
        <div className="grid gap-6">
          {serviceRequests.map((request) => (
            <ServiceRequestItem
              request={request}
              formatDate={formatDate}
              key={request.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ListServiceRequests = () => {
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState<
    Schema["ServiceRequest"]["type"][]
  >([]);

  const fetchServiceRequests = async () => {
    const sub = client.models.ServiceRequest.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setServiceRequests([...items]);
      },
    });
    return () => sub.unsubscribe();
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  return (
    <>
      <ServiceRequestList serviceRequests={serviceRequests} />
      <button
        className="fixed bottom-4 w-auto right-4 bg-[#A27B5C] text-white rounded-full p-4 shadow-lg hover:opacity-90 transition-opacity"
        onClick={() => navigate("/create")}
      >
        Service Request +
      </button>
    </>
  );
};

export default ListServiceRequests;
