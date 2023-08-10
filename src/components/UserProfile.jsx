import React from "react";
import { View, Text } from "react-native";

const UserProfile = ({ route }) => {
  const { userId } = route.params; // Récupère l'ID de l'utilisateur transmis depuis UsersList

  // Utilisez l'ID de l'utilisateur pour récupérer les données de l'utilisateur depuis Firestore
  // ...

  return (
    <View>
      <Text>User Profile Screen</Text>
      <Text>User ID: {userId}</Text>
      {/* Affichez les autres informations de l'utilisateur ici */}
    </View>
  );
};

export default UserProfile;
