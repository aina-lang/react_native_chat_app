import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { database } from "../../config/firebase";
import Icon from "react-native-vector-icons/FontAwesome5";
import AntIcon from "react-native-vector-icons/AntDesign";

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis Firestore
    const usersCollectionRef = collection(database, "users"); // Remplacez "users" par le nom de votre collection Firestore contenant les informations des utilisateurs
    const q = query(usersCollectionRef, orderBy("pseudo")); // Tri des utilisateurs par pseudo, vous pouvez changer le champ de tri selon vos besoins

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        console.log('====================================');
        console.log(doc.data().uid);
        console.log('====================================');
        userList.push({
          uid: data.uid,
          pseudo: data.pseudo,
          email: data.email,
          // Ajoutez d'autres champs d'informations sur l'utilisateur si nécessaire
        });
      });

      setUsers(userList);
    });

    return () => {
      // Se désabonner de la mise à jour en temps réel lorsque le composant se démonte
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userItemContainer}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.pseudo}</Text>
        <Text>{item.email}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            navigation.navigate("UserProfile", { userId: item.uid })
          }
        >
          <Text>
            <Icon name="user" size={30} color="blue" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            navigation.navigate("Chat", {
              targetUser: { uid: item.uid, email: item.email, pseudo: item.pseudo },
            })
          }
        >
          <AntIcon name="message1" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  userItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    padding: 10,
  },
});

export default UsersList;
