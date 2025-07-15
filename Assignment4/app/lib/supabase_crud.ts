import { supabase } from "./supabase";

// Define the type for your data
export interface SampleData {
  id?: number;
  created_at?: string;
  name: string;
}

const tableName = "user_details";

// CREATE - Add new data
export const createUser = async (name: string) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert([{ name }])
    .select();

  if (error) throw error;
  return data;
};

// READ - Get all data
export const getUsers = async () => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// UPDATE - Update existing data
export const updateUser = async (id: number, name: string) => {
  const { data, error } = await supabase
    .from(tableName)
    .update({ name })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

// DELETE - Delete data
export const deleteUser = async (id: number) => {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) throw error;
  return true;
};
