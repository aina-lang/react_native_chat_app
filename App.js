import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import Home from "./src/screens/Home";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Chat from "./src/screens/Chat";
import UsersList from "./src/components/UsersList";
import UserProfile from "./src/components/UserProfile";

const Stack = createStackNavigator();

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        title: "",
        cardStyle: {
          backgroundColor: "rgb(59 ,130 ,246)",
        },
        cardShadowEnabled: false,
        headerStyle: {
          height: 120,
          backgroundColor: "rgb(59 ,130 ,246)",
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
    
      {/* <Stack.Screen name="Home" component={Home} /> */}
      <Stack.Screen name="UsersList" component={UsersList}/>
      <Stack.Screen name="Chat" component={Chat} />
     
      <Stack.Screen name="UserProfile" component={UserProfile}/>
      {/*  Ajoutez ici d'autres écrans de la pile de chat si nécessaire */}
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
    screenOptions={{
     headerTitleAlign:"center",
      cardStyle: {
        backgroundColor: "rgb(59 ,130 ,246)",
      },
      headerTitleStyle: {
        color: '#fff',
        // use your preferred color code
      },
      cardShadowEnabled: false,
      headerStyle: {
        height: 120,
        backgroundColor: "rgb(59 ,130 ,246)",
        elevation: 0,
        shadowOpacity: 0,
        
      },
    }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    
     
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // if (loading) {
  //   return (
  //     <View>
  //       <ActivityIndicator size={"large"} />
  //     </View>
  //   );
  // }
  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
