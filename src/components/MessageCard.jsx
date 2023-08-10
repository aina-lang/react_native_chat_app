import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const MessageCard = ({ senderName, senderPhoto, sendDate, message }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={"https://i.pravatar.cc/300"} style={styles.profileImage} />
      <View style={styles.messageContent}>
        <Text style={styles.senderName}>{senderName}</Text>
        <Text style={styles.sendDate}>{sendDate}</Text>
        <Text style={styles.messageText}>{message}</Text>
        {/* {message.length > 20 && <Text style={styles.ellipsis}>...</Text>} */}
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  sendDate: {
    color: "gray",
    marginBottom: 5,
  },
  messageText: {
    marginBottom: 10,
  },
  ellipsis: {
    fontStyle: "italic",
    color: "gray",
  },
});

export default MessageCard;
