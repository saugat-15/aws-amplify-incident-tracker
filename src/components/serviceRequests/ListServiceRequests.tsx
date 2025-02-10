import React, { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import ServiceRequestsTable from "./ServiceRequestTable";
import SeverityDistributionChart from "./SeverityDistributionChart";
import SeverityBadge from "./SeverityBadge";
import { SortingState } from "@tanstack/react-table";

const client = generateClient<Schema>();

interface ListServiceRequestsProps {
  displayChart?: boolean;
}

const ListServiceRequests: React.FC<ListServiceRequestsProps> = ({
  displayChart,
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<
    Schema["ServiceRequest"]["type"][]
  >([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const fetchServiceRequests = async () => {
    const sub = client.models.ServiceRequest.observeQuery().subscribe({
      next: ({ items }) => {
        setServiceRequests([...items]);
      },
    });
    return () => sub.unsubscribe();
  };

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    fetchServiceRequests();
    checkIfMobile();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3930] mb-8">
          Service Requests
        </h2>

        {displayChart && (
          <SeverityDistributionChart serviceRequests={serviceRequests} />
        )}
        {!isMobile && (
          <ServiceRequestsTable
            data={serviceRequests}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            sorting={sorting}
            setSorting={setSorting}
          />
        )}

        {isMobile && (
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <ServiceRequestItem
                key={request.id}
                request={request}
                formatDate={(dateString) =>
                  new Date(dateString).toLocaleDateString()
                }
              />
            ))}
          </div>
        )}

        {
          <button
            className="fixed cursor-pointer bottom-4 right-4 bg-[#A27B5C] text-white rounded-full p-4 shadow-lg hover:opacity-90 transition-opacity"
            onClick={() => {
              if (!window.location.pathname.includes("create")) {
                navigate("/create");
              } else {
                window.scrollTo(0, 0);
              }
            }}
          >
            Service Request +
          </button>
        }
      </div>
    </div>
  );
};

export default ListServiceRequests;

const ServiceRequestItem = ({
  request,
  formatDate,
}: {
  request: Schema["ServiceRequest"]["type"];
  formatDate: (dateString: string) => string;
}) => (
  <div
    key={request.id}
    className="bg-[#3F4F44] rounded-lg shadow-lg overflow-hidden mb-4 md:mb-6"
  >
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[#DCD7C9] mb-2 sm:mb-0">
          id: {request.id}
        </h4>
        <h3 className="text-xl font-semibold text-[#DCD7C9] mb-2 sm:mb-0">
          {request.serviceName}
        </h3>
        <SeverityBadge severity={request.severity || "LOW"} />
      </div>
      <ServiceRequestDetails request={request} formatDate={formatDate} />
    </div>
  </div>
);

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
