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

export default SeverityBadge;
