import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SeverityDistributionChart = ({
  serviceRequests,
}: {
  serviceRequests: Schema["ServiceRequest"]["type"][];
}) => {
  const severityCount = serviceRequests.reduce(
    (acc, request) => {
      acc[request.severity || "LOW"] += 1;
      return acc;
    },
    { HIGH: 0, MEDIUM: 0, LOW: 0 }
  );

  const chartData = [
    { severity: "HIGH", count: severityCount.HIGH },
    { severity: "MEDIUM", count: severityCount.MEDIUM },
    { severity: "LOW", count: severityCount.LOW },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-[#2C3930] mb-4">
        Severity Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#A27B5C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeverityDistributionChart;
