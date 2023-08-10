import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from "../../config/firebase";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getAuth, signOut } from "firebase/auth";

const ChatScreen = ({ route }) => {
  const { targetUser } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  const onSignOut = () => {
    const authInstance = getAuth();
    signOut(authInstance)
      .then(() => {
        console.log("Utilisateur déconnecté avec succès.");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "rgb(59, 130, 246)",
        shadowOpacity: 0.5,
        elevation: 2,
        height: 80,
      },
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <MaterialIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-circle" color={"white"} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {targetUser.pseudo}
              </Text>
              <Text style={{ color: "white" }}>{targetUser.email}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, targetUser]);
  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");

    const q = query(
      collectionRef,
      orderBy("createdAt", "asc"),
      where("expediteur._id", "in", [currentUser.uid, targetUser.uid]),
      where("destinateur._id", "in", [currentUser.uid, targetUser.uid])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: {
            _id: doc.data().expediteur._id,
            avatar: doc.data().expediteur.avatar,
            name: doc.data().expediteur.pseudo,
          },
        }))
      );
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, targetUser]);

  // Evenement quand on envoie un message
  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      messages.forEach((message) => {
        const { _id, createdAt, text } = message;

        const newMessage = {
          _id,
          createdAt,
          text,
          expediteur: {
            _id: currentUser.uid,
            pseudo: currentUser.pseudo || "unknown",
            avatar: "https://i.pravatar.cc/300",
          },
          destinateur: {
            _id: targetUser.uid,
            pseudo: targetUser.pseudo || "unknown",
            avatar: "https://i.pravatar.cc/300",
          },
        };

        addDoc(collection(database, "chats"), newMessage)
          .then(() => {
            console.log("Message sent successfully!");
          })
          .catch((error) => {
            console.error("Error sending message:", error);
          });
      });
    },
    [currentUser, targetUser]
  );
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0", // Background color for received messages
          },
          right: {
            backgroundColor: "#007AFF",
          },
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: currentUser.uid,
          avatar: "https://i.pravatar.cc/300",
        }}
        renderBubble={renderBubble}
      />
    </View>
  );
};

export default ChatScreen;
