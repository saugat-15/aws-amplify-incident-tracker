import { z } from "zod";
import { Schema } from "../data/resource";
import dayjs from "dayjs";

const serviceRequestSchema = z.object({
  id: z.string().uuid(), // Ensures it's a valid UUID
  serviceName: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  resolutionDate: z.string().refine(
    (val) => {
      return dayjs(val).isValid() && dayjs(val).toISOString() === val;
    },
    {
      message: "Invalid ISO 8601 date format",
    }
  ),
  reporterName: z.string().min(1, "Reporter name is required"),
  contactEmail: z.string().email("Invalid email format"),
  location: z.string().min(1, "Location is required"),
});

const serviceRequestSchemaWithoutId = serviceRequestSchema.omit({ id: true });

export const validateServiceRequest = (
  data: Omit<Schema["ServiceRequest"]["type"], "createdAt" | "updatedAt">
) => {
  const result = serviceRequestSchema.safeParse(data);
  if (result.success) {
    return { valid: true, data: result.data };
  } else {
    return { valid: false, errors: result.error.format() };
  }
};

export const validateServiceRequestWithoutId = (
  data: Omit<Schema["ServiceRequest"]["type"], "id" | "createdAt" | "updatedAt">
) => {
  const result = serviceRequestSchemaWithoutId.safeParse(data);
  if (result.success) {
    return { valid: true, data: result.data };
  } else {
    return { valid: false, errors: result.error.format() };
  }
};
