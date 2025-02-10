import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ImageComponent from "./components/imageComponents/ImageContainer";
import ServiceRequestForm from "./components/serviceRequests/ServiceRequestForm";
import ListServiceRequests from "./components/serviceRequests/ListServiceRequests";
import SplashScreen from "./components/SplashScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ListServiceRequests />,
  },
  {
    path: "/create",
    element: <ServiceRequestForm />,
  },
  {
    path: "/splash",
    element: <SplashScreen />,
  },
]);

export default function TodoList() {
  return <RouterProvider router={router} />;
}
