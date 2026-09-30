import { v4 as uuidv4 } from "uuid";

// Default demo user and initial state
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export const mockStore = {
  profiles: [
    {
      id: DEMO_USER_ID,
      email: "farmer@agri-advisor.com",
      full_name: "Rajesh Kumar (Demo Farmer)",
      created_at: new Date().toISOString()
    }
  ],
  fields: [
    {
      id: "f101-north-field",
      user_id: DEMO_USER_ID,
      field_name: "Green Acres - North Sector",
      region: "Punjab (Northern Plains)",
      soil_type: "Alluvial",
      ph_level: 6.8,
      nitrogen_ppm: 140,
      phosphorus_ppm: 45,
      potassium_ppm: 210,
      irrigation_type: "Drip Irrigation",
      season: "Kharif",
      crop_type: "Rice (Paddy)",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: "f102-black-soil-plot",
      user_id: DEMO_USER_ID,
      field_name: "Vidarbha Cotton Plot",
      region: "Maharashtra (Deccan Plateau)",
      soil_type: "Black (Regur)",
      ph_level: 7.9,
      nitrogen_ppm: 95,
      phosphorus_ppm: 22,
      potassium_ppm: 340,
      irrigation_type: "Canal / Flood",
      season: "Rabi",
      crop_type: "Cotton",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  advisories: [
    {
      id: "adv-101",
      field_id: "f101-north-field",
      summary: "Optimal soil pH (6.8) for paddy. Moderate Nitrogen deficiency detected. Top-dressing with Neem-Coated Urea recommended alongside split potassium application.",
      recommendations: {
        fertilizer_plan: [
          "Apply 45 kg/acre Neem-Coated Urea at basal stage",
          "Apply 20 kg/acre Single Super Phosphate (SSP)",
          "Top-dress 25 kg/acre Muriate of Potash (MOP) at tillering stage",
          "Foliar spray of 1% Zinc Sulphate to counteract micro-nutrient binding"
        ],
        irrigation_schedule: "Maintain 2-3 cm shallow water standing for first 15 days, followed by alternate wetting and drying (AWD) cycle every 5-7 days.",
        pest_warnings: [
          "Monitor for Yellow Stem Borer during early tillering stage",
          "High humidity warning: Risk of Brown Plant Hopper (BPH); install light traps",
          "Bacterial Leaf Blight risk if nitrogen is over-applied"
        ],
        soil_health_notes: "Soil organic carbon level is healthy. Maintain green manuring (Dhaincha/Sesbania) post harvest."
      },
      risk_factors: [
        { severity: "High", issue: "Low Nitrogen Reserves", action: "Execute timed urea application within 7 days." },
        { severity: "Medium", issue: "Seasonal Humidity Rise", action: "Deploy neem oil spray (10,000 ppm) at first pest sign." }
      ],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

export function getMockUserId(req) {
  return req.user?.id || DEMO_USER_ID;
}
