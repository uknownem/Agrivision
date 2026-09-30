import { fieldSchema } from "../lib/validators.js";
import { supabase, isSupabaseConfigured } from "../config/supabase.js";
import { mockStore, getMockUserId } from "../lib/mockStore.js";
import { v4 as uuidv4 } from "uuid";

export async function getFields(req, res) {
  try {
    const userId = req.user.id;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("fields")
        .select("*, advisories(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching fields:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ fields: data || [] });
    }

    // Fallback Mock Store
    const userFields = mockStore.fields.filter((f) => f.user_id === userId || userId === "00000000-0000-0000-0000-000000000001");
    const fieldsWithAdvisories = userFields.map((field) => ({
      ...field,
      advisories: mockStore.advisories.filter((a) => a.field_id === field.id)
    }));

    return res.json({ fields: fieldsWithAdvisories });
  } catch (err) {
    console.error("getFields error:", err);
    res.status(500).json({ error: "Server error fetching fields" });
  }
}

export async function getFieldById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("fields")
        .select("*, advisories(*)")
        .eq("id", id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Field profile not found" });
      }

      return res.json({ field: data });
    }

    const field = mockStore.fields.find((f) => f.id === id);
    if (!field) {
      return res.status(404).json({ error: "Field profile not found" });
    }

    const advisories = mockStore.advisories.filter((a) => a.field_id === field.id);
    return res.json({ field: { ...field, advisories } });
  } catch (err) {
    console.error("getFieldById error:", err);
    res.status(500).json({ error: "Server error retrieving field" });
  }
}

export async function createField(req, res) {
  try {
    const validation = fieldSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors
      });
    }

    const userId = req.user.id;
    const fieldData = {
      ...validation.data,
      user_id: userId
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("fields")
        .insert([fieldData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert field error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ message: "Field registered successfully", field: data });
    }

    // Mock store saving
    const newField = {
      id: "f-" + uuidv4().slice(0, 8),
      ...fieldData,
      created_at: new Date().toISOString(),
      advisories: []
    };

    mockStore.fields.unshift(newField);
    return res.status(201).json({ message: "Field registered successfully", field: newField });
  } catch (err) {
    console.error("createField error:", err);
    res.status(500).json({ error: "Server error creating field profile" });
  }
}

export async function deleteField(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("fields")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json({ message: "Field deleted successfully" });
    }

    const index = mockStore.fields.findIndex((f) => f.id === id);
    if (index !== -1) {
      mockStore.fields.splice(index, 1);
    }
    return res.json({ message: "Field deleted successfully" });
  } catch (err) {
    console.error("deleteField error:", err);
    res.status(500).json({ error: "Failed to delete field" });
  }
}
