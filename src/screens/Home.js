import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  DrawerLayoutAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MessageCard from "../components/MessageCard";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { auth, database } from "../../config/firebase";
import { getHeaderTitle } from "@react-navigation/elements";
import UsersList from "../components/UsersList";

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Récupérer les messages depuis Firestore
    const collectionRef = collection(database, "chats"); // Remplacez "messages" par le nom de votre collection Firestore
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        messageData.push({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        });
      });
      setMessages(messageData);
    });

    return () => {
      // Se désabonner de la mise à jour en temps réel lorsque le composant se démonte
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Utilisateur déconnecté avec succès.");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen((prevIsOpen) => !prevIsOpen);
  };

  const openChat = () => {
    navigation.navigate("Chat");
  };


  const listUser=()=>{
    navigation.navigate("UsersList");
  }

  useEffect(() => {
    setMessages([{ _id: 0, text: "message", createdAt: "2023-25-20" }]);
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style="mx-4" onPress={handleLogout}>
          <Image
            source=""
            className="bg-gray-100 w-[40px] h-[40px] mr-2 rounded-full"
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity style="ml-10" onPress={handleLogout}>
          <Text className="text-white text-2xl p-5">Message</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const sidebar = (
    <View style="flex-1 bg-blue-500 p-4">
      <TouchableOpacity
        style="py-2 border-b border-gray-300"
        onPress={() => console.log("Profile")}
      >
        <Text style="text-lg font-bold text-gray-800">Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style="py-2 border-b border-gray-300"
        onPress={() => console.log("Paramètres")}
      >
        <Text style="text-lg font-bold text-gray-800">Paramètres</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style="py-2 border-b border-gray-300"
        onPress={handleLogout}
      >
        <Text style="text-lg font-bold text-gray-800">Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // <DrawerLayoutAndroid
    //   ref={(ref) => (this.drawer = ref)}
    //   drawerWidth={250}
    //   drawerPosition="right"
    //   onDrawerClose={toggleSidebar}
    //   onDrawerOpen={toggleSidebar}
    //   renderNavigationView={() => sidebar}
    // >
    <View
      className="flex-1 h-full w-full bg-white"
      style={{ borderTopRightRadius: 30, borderTopLeftRadius: 30 }}
    >
      <TouchableOpacity
        className=" bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        style={{
          position: "absolute",
          bottom: 20,
          right: 25,
          zIndex: 9999,
        }}
        onPress={listUser}
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>

      <ScrollView style="px-4 pt-16" showsVerticalScrollIndicator={false}>
        <ScrollView style="px-4 pt-16" showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message.text}
              // senderName={message.user}
              senderPhoto={message.senderPhoto}
              // sendDate={message.createdAt}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
    // </DrawerLayoutAndroid>
  );
};

export default Home;

{
  /* <ScrollView style="px-4 pt-16" showsVerticalScrollIndicator={false}>
          {/* Messages 
          {messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message.text}
              // senderName={message.user}
              senderPhoto={message.senderPhoto}
              // sendDate={message.createdAt}
            />
          ))}

         
        </ScrollView> */
}
