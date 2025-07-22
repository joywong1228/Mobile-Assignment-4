import { supabase } from "./supabase";

export interface UserDetails {
  uuid?: string;
  first_name: string;  // Changed from FirstName
  last_name: string;   // Changed from LastName
  email: string;       // Changed from Email
  password?: string; // optional when updating
}

const tableName = "user_details";

// CREATE a new user
export const createUser = async (user: UserDetails) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert([user])
    .select();
  if (error) throw error;
  return data;
};

// READ all users (will only return current user's data due to RLS)
export const getUsers = async () => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("first_name", { ascending: true });
  if (error) throw error;
  return data;
};

// READ current user's profile
export const getCurrentUserProfile = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("uuid", user.id)
    .single();
    
  if (error) throw error;
  return data;
};

// UPDATE user by UUID (will only update current user due to RLS)
export const updateUser = async (
  uuid: string,
  updates: Partial<UserDetails>
) => {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq("uuid", uuid)
    .select();
  if (error) throw error;
  return data;
};

// DELETE user by UUID (will only delete current user due to RLS)
export const deleteUser = async (uuid: string) => {
  const { error } = await supabase.from(tableName).delete().eq("uuid", uuid);
  if (error) throw error;
  return true;
};