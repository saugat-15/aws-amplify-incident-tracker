import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ImageComponent from "./components/imageComponents/ImageContainer";
import ServiceRequestForm from "./components/serviceRequests/ServiceRequestForm";
import ListServiceRequests from "./components/serviceRequests/ListServiceRequests";
import SplashScreen from "./components/SplashScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/dashboard",
    element: <ListServiceRequests displayChart={true} />,
  },
  {
    path: "/create",
    element: <ServiceRequestForm />,
  },
  { path: "/images/upload", element: <ImageComponent /> },
  {
    path: "/gallery",
    element: <ImageComponent />,
  },
  { path: "/images/upload", element: <ImageComponent /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
