import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "./lib/supabase";

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    console.log("🔄 Signing up...");

    // Add timeout fallback in case Supabase hangs
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout: Signup took too long")), 5000)
    );

    try {
      const { data: signUpData, error: signUpError } = await Promise.race([
        supabase.auth.signUp({ email, password }),
        timeout,
      ]);

      if (signUpError) {
        console.log("❌ Sign-up error:", signUpError.message);
        Alert.alert("Sign-up failed", signUpError.message);
        return;
      }

      console.log("✅ Signed up:", signUpData);

      // Optional: Auto sign-in (if no email confirmation required)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.log("⚠️ Auto sign-in failed:", signInError.message);
        Alert.alert("Auto sign-in failed", signInError.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const uuid = user?.id;
      if (!uuid) {
        Alert.alert("Signup failed", "User ID missing.");
        return;
      }

      // Insert extra user details
      const { error: insertError } = await supabase
        .from("user_details")
        .insert({
          uuid,
          FirstName: firstName,
          LastName: lastName,
          Email: email,
        });

      if (insertError) {
        console.log("❌ Insert failed:", insertError.message);
        Alert.alert("Insert failed", insertError.message);
        return;
      }

      Alert.alert("Success", "Account created! You can now sign in.");
      //   router.replace("/signin");
    } catch (err: any) {
      console.log("❌ Exception:", err.message);
      Alert.alert("Signup error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        placeholder="First Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.toggleBtn}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signin")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleBtn: {
    color: "#38bdf8",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 5 : 0,
    marginBottom: 16,
  },
  buttonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 17,
  },
});
