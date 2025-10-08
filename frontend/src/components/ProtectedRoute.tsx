import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../store";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    // This can happen if the component is not wrapped in StoreProvider
    return <Navigate to="/login" />;
  }

  const { token } = storeContext;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;