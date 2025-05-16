import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    //these are the props that user or coder passes to WrappedCOmponet but bc withAuth we're not rendering wrappedCOm. but authComponet so props are passed to it which will then pass it to wrappedCOmponent again on successful authentication ⚡⚡
    const router = useNavigate();
    const isAuthenticated = () => {
      if (localStorage.getItem("token")) {
        return true;
      }
      return false;
    };
    useEffect(() => {
      if (!isAuthenticated()) {
        router("/auth");
      }
    }, []);
    return <WrappedComponent {...props}/>
  }
  return AuthComponent;
};

export default withAuth;
