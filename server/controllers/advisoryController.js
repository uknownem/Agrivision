import { advisoryGenerateSchema } from "../lib/validators.js";
import { ai, isGeminiConfigured } from "../config/gemini.js";
import { supabase, isSupabaseConfigured } from "../config/supabase.js";
import { mockStore } from "../lib/mockStore.js";
import { v4 as uuidv4 } from "uuid";

const SYSTEM_PROMPT = `You are an expert Principal Agronomist and AI Agricultural Advisor with decades of field experience in sustainable farming, soil science, and crop pathology. Provide precise, scientifically sound, actionable, and safety-compliant crop advisories based strictly on the provided soil metrics, regional climate, and crop profile. Avoid generic advice; prioritize localized, sustainable, and economically viable solutions.`;

export async function generateAdvisory(req, res) {
  try {
    const validation = advisoryGenerateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors
      });
    }

    const {
      field_id,
      field_name,
      region,
      soil_type,
      ph_level,
      nitrogen_ppm,
      phosphorus_ppm,
      potassium_ppm,
      irrigation_type,
      season,
      crop_type,
      language
    } = validation.data;

    const userPrompt = `
Generate a comprehensive agricultural advisory for the following crop & field profile:
- Field Name: ${field_name}
- Crop Type: ${crop_type}
- Region / Climate Zone: ${region}
- Soil Type: ${soil_type}
- Soil pH Level: ${ph_level} (Ideal crop pH usually 6.0 - 7.5)
- Nitrogen (N): ${nitrogen_ppm} ppm
- Phosphorus (P): ${phosphorus_ppm} ppm
- Potassium (K): ${potassium_ppm} ppm
- Irrigation Source: ${irrigation_type}
- Target Season: ${season}
- Output Language: ${language} (Please translate all output fields naturally into ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'es' ? 'Spanish' : 'English'})

Analyze soil NPK balance, pH acidity/alkalinity adjustments, crop nutrient demands, evapotranspiration irrigation guidelines, and key IPM (Integrated Pest Management) precautions.
Return the output strictly matching the required JSON schema.
`;

    let generatedData = null;

    if (isGeminiConfigured && ai) {
      try {
        const responseSchema = {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            fertilizer_plan: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            irrigation_schedule: { type: "STRING" },
            pest_warnings: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            soil_health_notes: { type: "STRING" },
            risk_factors: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  severity: { type: "STRING" },
                  issue: { type: "STRING" },
                  action: { type: "STRING" }
                },
                required: ["severity", "issue", "action"]
              }
            }
          },
          required: ["summary", "fertilizer_plan", "irrigation_schedule", "pest_warnings", "risk_factors"]
        };

        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        });

        if (result.text) {
          generatedData = JSON.parse(result.text);
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, invoking expert fallback generator:", geminiError.message);
      }
    }

    // Fallback if Gemini key is absent or failed
    if (!generatedData) {
      generatedData = createExpertFallbackAdvisory({
        field_name,
        region,
        soil_type,
        ph_level,
        nitrogen_ppm,
        phosphorus_ppm,
        potassium_ppm,
        crop_type,
        season,
        language
      });
    }

    // Format final structure for Supabase PostgreSQL schema
    const advisoryRecord = {
      id: "adv-" + uuidv4().slice(0, 8),
      field_id: field_id || null,
      summary: generatedData.summary,
      recommendations: {
        fertilizer_plan: generatedData.fertilizer_plan || [],
        irrigation_schedule: generatedData.irrigation_schedule || "",
        pest_warnings: generatedData.pest_warnings || [],
        soil_health_notes: generatedData.soil_health_notes || ""
      },
      risk_factors: generatedData.risk_factors || [],
      created_at: new Date().toISOString()
    };

    // Save to Supabase if configured & field_id provided
    if (isSupabaseConfigured && supabase && field_id) {
      const { data, error } = await supabase
        .from("advisories")
        .insert([{
          field_id: field_id,
          summary: advisoryRecord.summary,
          recommendations: advisoryRecord.recommendations,
          risk_factors: advisoryRecord.risk_factors
        }])
        .select()
        .single();

      if (!error && data) {
        advisoryRecord.id = data.id;
        advisoryRecord.created_at = data.created_at;
      }
    } else {
      mockStore.advisories.unshift(advisoryRecord);
    }

    res.status(201).json({
      message: "Advisory generated successfully",
      advisory: advisoryRecord
    });
  } catch (err) {
    console.error("generateAdvisory error:", err);
    res.status(500).json({ error: "Failed to generate AI advisory: " + err.message });
  }
}

export async function getAdvisoryById(req, res) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("advisories")
        .select("*, fields(*)")
        .eq("id", id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Advisory report not found" });
      }

      return res.json({ advisory: data });
    }

    const advisory = mockStore.advisories.find((a) => a.id === id);
    if (!advisory) {
      return res.status(404).json({ error: "Advisory report not found" });
    }

    const field = mockStore.fields.find((f) => f.id === advisory.field_id);
    return res.json({ advisory: { ...advisory, fields: field } });
  } catch (err) {
    console.error("getAdvisoryById error:", err);
    res.status(500).json({ error: "Failed to retrieve advisory" });
  }
}

export async function getAdvisoriesByField(req, res) {
  try {
    const { fieldId } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("advisories")
        .select("*")
        .eq("field_id", fieldId)
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ advisories: data || [] });
    }

    const list = mockStore.advisories.filter((a) => a.field_id === fieldId);
    return res.json({ advisories: list });
  } catch (err) {
    console.error("getAdvisoriesByField error:", err);
    res.status(500).json({ error: "Failed to list field advisories" });
  }
}

// Rule-based expert fallback for demo / keyless testing
function createExpertFallbackAdvisory({ field_name, region, soil_type, ph_level, nitrogen_ppm, phosphorus_ppm, potassium_ppm, crop_type, season, language }) {
  const isAcidic = ph_level < 6.0;
  const isAlkaline = ph_level > 7.5;
  const nLow = nitrogen_ppm < 120;
  const pLow = phosphorus_ppm < 30;
  const kLow = potassium_ppm < 150;

  const nPlan = nLow
    ? "Apply 50 kg/acre Neem-Coated Urea in split doses (50% basal, 25% vegetative, 25% flowering stage)."
    : "Nitrogen status is adequate; apply minimal maintenance top-dressing (20 kg/acre Urea).";

  const pPlan = pLow
    ? "Apply 40 kg/acre Single Super Phosphate (SSP) or DAP at sowing time to promote root development."
    : "Phosphorus levels are sufficient; no immediate phosphate fertilizer needed.";

  const kPlan = kLow
    ? "Apply 30 kg/acre Muriate of Potash (MOP) at basal dressing to boost stress resistance and grain filling."
    : "Potassium levels are optimal for " + crop_type + ".";

  const phAdvice = isAcidic
    ? "Soil is acidic (pH " + ph_level + "). Apply agricultural lime (calcium carbonate) at 200 kg/acre before tilling to optimize nutrient uptake."
    : isAlkaline
    ? "Soil is alkaline (pH " + ph_level + "). Apply elemental sulfur or gypsum (150 kg/acre) and organic compost to lower root-zone pH."
    : "Soil pH (" + ph_level + ") is within the ideal range for nutrient availability.";

  return {
    summary: `Tailored Agronomic Advisory for ${crop_type} in ${region} (${soil_type} soil). pH status is ${ph_level}. NPK balances analyzed: Nitrogen ${nitrogen_ppm} ppm, Phosphorus ${phosphorus_ppm} ppm, Potassium ${potassium_ppm} ppm.`,
    fertilizer_plan: [
      nPlan,
      pPlan,
      kPlan,
      phAdvice,
      "Incorporate 2-3 metric tons of well-decomposed Farmyard Manure (FYM) or vermicompost to build soil microbial activity."
    ],
    irrigation_schedule: `Irrigate every 6-8 days during key phenological stages (vegetative growth and panicle/flowering initiation). Avoid waterlogging in ${soil_type} soil to prevent root rot.`,
    pest_warnings: [
      `Monitor ${crop_type} for early warning signs of leaf spot or stem rot during warm conditions.`,
      "Spray 5% Neem Kernel Extract (NSKE) or azadirachtin 10,000 ppm as a organic prophylactic measure.",
      "Install yellow sticky traps (10 traps/acre) for monitoring whiteflies and aphids."
    ],
    soil_health_notes: `Maintain organic mulching to conserve moisture in ${region}. Perform periodic soil testing every 2 crop cycles.`,
    risk_factors: [
      {
        severity: nLow ? "High" : "Low",
        issue: nLow ? "Sub-optimal Nitrogen Reserve" : "Balanced Nitrogen",
        action: nLow ? "Execute split urea application immediately post-weeding." : "Routine maintenance monitoring."
      },
      {
        severity: (isAcidic || isAlkaline) ? "Medium" : "Low",
        issue: (isAcidic || isAlkaline) ? `pH Imbalance (${ph_level})` : "pH Balanced",
        action: (isAcidic || isAlkaline) ? "Apply corrective soil amendments prior to next fertilizer application." : "Optimal soil absorption."
      }
    ]
  };
}
