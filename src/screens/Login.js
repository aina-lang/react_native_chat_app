import React from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useState } from "react";
import { useEffect } from "react";

export default ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigation.navigate("Home");
          console.log("Login success");
        })
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Login",
      headerTitleAlign: "center",
      
    });
  }, [navigation]);

  return (
    <View className="flex-1 h-full w-full bg-white"
    style={{ borderTopRightRadius: 30, borderTopLeftRadius: 30 }}>
      <View className="w-full p-10 pt-20 ">
        <TextInput
          className="w-full h-12 bg-gray-100 rounded px-5 mb-5 "
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoFocus
        />
        <TextInput
          className="w-full h-12 bg-gray-100 rounded px-5 mb-5 "
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          textContentType="password"
        />
        <View className="flex   justify-center ">
          <TouchableOpacity
            className="bg-blue-500  h-10 rounded items-center justify-center"
            onPress={onHandleLogin}
          >
            <Text className="text-white font-bold text-16">Se connecter</Text>
          </TouchableOpacity>
          <Text className=" text-center mt-5 h-10 rounded items-center justify-center">
            Vous n'avez pas de compte ? {"  "}
            <Text
              className="text-red-500 font-bold text-16"
              onPress={() => navigation.navigate("Signup")}
            >
              S'inscrire
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
