import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "./lib/supabase";
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error or no user", authError);
        router.replace("/signin");
        return;
      }

      // Fixed column names to match database schema
      const { data, error } = await supabase
        .from("user_details")
        .select("first_name, last_name")
        .eq("uuid", user.id)
        .maybeSingle();

      console.log("Signed in user ID:", user.id);

      if (error) {
        console.error("Error fetching user details:", error.message);
      } else if (!data) {
        console.warn("No user detail found for this UUID");
      } else {
        setFullName(`${data.first_name} ${data.last_name}`);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        🎉 Welcome{fullName ? `, ${fullName}!` : "!"}
      </Text>
      <Text style={styles.subtitle}>You are successfully signed in!</Text>
      <Text style={styles.description}>
        This is the landing page of your app.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        {loading ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#cbd5e1",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "600",
  },
});