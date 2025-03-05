import StackNavigator from "./components/StackNavigator";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <StackNavigator />
    </PaperProvider>
  );
}
