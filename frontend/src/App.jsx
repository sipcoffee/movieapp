import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import ContextProvider from "./context";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <ContextProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ContextProvider>
    </>
  );
}

export default App;
