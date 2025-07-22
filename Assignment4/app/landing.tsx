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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Landing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrInsertUserDetails = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error or no user", authError);
        return;
      }

      // 1. Try to fetch user_details
      const { data, error } = await supabase
        .from("user_details")
        .select("FirstName, LastName")
        .eq("uuid", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user details:", error.message);
        return;
      }

      if (!data) {
        // 2. Try to get from AsyncStorage (from sign-up step)
        const firstName = await AsyncStorage.getItem("pendingUserFirstName");
        const lastName = await AsyncStorage.getItem("pendingUserLastName");

        if (firstName && lastName) {
          // 3. Insert into user_details
          const { error: insertError } = await supabase
            .from("user_details")
            .insert({
              uuid: user.id,
              FirstName: firstName,
              LastName: lastName,
              Email: user.email,
            });
          if (insertError) {
            console.error("Insert failed:", insertError.message);
            setFullName(null);
            return;
          }
          setFullName(`${firstName} ${lastName}`);
          // Clean up storage
          await AsyncStorage.removeItem("pendingUserFirstName");
          await AsyncStorage.removeItem("pendingUserLastName");
        } else {
          setFullName(null);
          // Optionally, navigate user to a profile completion page or show a prompt
        }
        return;
      }

      setFullName(`${data.FirstName} ${data.LastName}`);
    };

    fetchOrInsertUserDetails();
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
  },
  subtitle: {
    fontSize: 18,
    color: "#cbd5e1",
    marginBottom: 8,
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
