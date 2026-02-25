import { Layout } from "./components/Layout";
import type { UserModel } from "./types";
import "./App.css"; // Keep the styles if any, or maybe we can drop it since Tailwind is used in Layout?

// Mock user for now
const mockUser: UserModel = {
  id: "u_1",
  name: "Guest User",
  preferences: {
    theme: "dark",
    reducedMotion: false,
  },
};

function App() {
  return <Layout user={mockUser} />;
}

export default App;
