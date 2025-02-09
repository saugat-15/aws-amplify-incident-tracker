import ImageComponent from "./components/imageComponents/ImageContainer";
import ServicRequestForm from "./components/serviceRequests/ServiceRequestForm";
import ListServiceRequests from "./components/serviceRequests/ListServiceRequests";
import SplashScreen from "./components/SplashScreen";

export default function TodoList() {
  return (
    <>
      <SplashScreen />
      <ImageComponent />
      <ListServiceRequests />
      <ServicRequestForm />
    </>
  );
}
