import React from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../config/firebase";
import { useState } from "react";
import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";

export default ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");

  const onHandleSignup = () => {
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Utilisateur inscrit avec succès
          const user = userCredential.user;
          const { uid, email } = user;
          // Enregistrez d'autres informations d'utilisateur dans Firestore
          const usersCollectionRef = collection(database, "users"); // Remplacez "users" par le nom de votre collection Firestore contenant les informations des utilisateurs
          const userDocRef = doc(usersCollectionRef, uid);

          setDoc(userDocRef, {
            uid: uid,
            email: email,
            pseudo: pseudo,
            // Ajoutez d'autres champs d'informations sur l'utilisateur si nécessaire
          })
            .then(() => {
              // Succès de l'enregistrement des informations d'utilisateur dans Firestore
              Alert.alert(
                "Inscription réussie !",
                "Votre compte a été créé avec succès."
              );
              // Redirigez l'utilisateur vers l'écran d'accueil ou l'écran de connexion.
              navigation.navigate("Home");
            })
            .catch((error) => {
              console.error(
                "Erreur lors de l'enregistrement des informations d'utilisateur :",
                error
              );
            });
        })
        .catch((err) => Alert.alert("Erreur lors de l'inscription", err.message));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 justify-center items-center p-5">
        <View className="w-full">
          <TextInput
            className="w-full h-12 bg-gray-100 rounded px-5 mb-5 "
            placeholder="Pseudo"
            value={pseudo}
            onChangeText={(text) => setPseudo(text)}
            autoFocus
          />
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
              className="bg-blue-500 w-full h-10 rounded items-center justify-center"
              onPress={onHandleSignup}
            >
              <Text className="text-white font-bold text-16">S'inscrire</Text>
            </TouchableOpacity>
            <Text className=" text-center mt-5 h-10 rounded items-center justify-center">
              Vous avez déjà un compte ? {"  "}
              <Text
                className="text-red-500 font-bold text-16"
                onPress={() => navigation.navigate("Login")}
              >
                S'identifier
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
