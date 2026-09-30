import { z } from "zod";

export const fieldSchema = z.object({
  field_name: z.string().min(2, "Field name must be at least 2 characters").max(100),
  region: z.string().min(2, "Region must be specified").max(100),
  soil_type: z.enum([
    "Alluvial",
    "Black (Regur)",
    "Red & Yellow",
    "Laterite",
    "Arid / Sandy",
    "Peaty / Organic",
    "Clay Loam",
    "Silty Loam",
    "Other"
  ]),
  ph_level: z.number().min(4.0, "pH cannot be lower than 4.0").max(10.0, "pH cannot exceed 10.0"),
  nitrogen_ppm: z.number().min(0, "Nitrogen must be positive").max(500),
  phosphorus_ppm: z.number().min(0, "Phosphorus must be positive").max(200),
  potassium_ppm: z.number().min(0, "Potassium must be positive").max(500),
  irrigation_type: z.string().default("Drip Irrigation"),
  season: z.string().default("Kharif (Monsoon)"),
  crop_type: z.string().default("Wheat")
});

export const advisoryGenerateSchema = z.object({
  field_id: z.string().optional(),
  field_name: z.string().min(2),
  region: z.string().min(2),
  soil_type: z.string(),
  ph_level: z.number().min(4.0).max(10.0),
  nitrogen_ppm: z.number().min(0),
  phosphorus_ppm: z.number().min(0),
  potassium_ppm: z.number().min(0),
  irrigation_type: z.string().default("Drip Irrigation"),
  season: z.string().default("Kharif"),
  crop_type: z.string().default("Wheat"),
  language: z.enum(["en", "hi", "mr", "es"]).default("en")
});

export const diagnosticScanSchema = z.object({
  crop_type: z.string().default("General Crop"),
  symptoms_description: z.string().optional(),
  language: z.enum(["en", "hi", "mr", "es"]).default("en")
});
