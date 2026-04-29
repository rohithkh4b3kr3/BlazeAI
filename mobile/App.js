import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import CurrencyScreen from "./src/screens/CurrencyScreen";
import WordCountScreen from "./src/screens/WordCountScreen";
import PasswordScreen from "./src/screens/PasswordScreen";
import JsonFormatterScreen from "./src/screens/JsonFormatterScreen";
import UnitConverterScreen from "./src/screens/UnitConverterScreen";
import PlagiarismScreen from "./src/screens/PlagiarismScreen";
import ImageToPdfScreen from "./src/screens/ImageToPdfScreen";
import ImageCompressScreen from "./src/screens/ImageCompressScreen";
import RemoveBgScreen from "./src/screens/RemoveBgScreen";
import PdfToWordScreen from "./src/screens/PdfToWordScreen";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: "#000" },
  headerTintColor: "#64ffda",
  headerTitleStyle: { fontWeight: "bold" },
  contentStyle: { backgroundColor: "#000" },
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "BlazeAI" }} />
        <Stack.Screen name="Currency" component={CurrencyScreen} />
        <Stack.Screen name="WordCount" component={WordCountScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="JsonFormatter" component={JsonFormatterScreen} />
        <Stack.Screen name="UnitConverter" component={UnitConverterScreen} />
        <Stack.Screen name="Plagiarism" component={PlagiarismScreen} />
        <Stack.Screen name="ImageToPdf" component={ImageToPdfScreen} />
        <Stack.Screen name="ImageCompress" component={ImageCompressScreen} />
        <Stack.Screen name="RemoveBg" component={RemoveBgScreen} />
        <Stack.Screen name="PdfToWord" component={PdfToWordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
