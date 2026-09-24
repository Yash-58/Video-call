import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const token = localStorage.getItem("token");

        useEffect(() => {
            if (!token) {
                router("/auth");
            }
        }, [token, router]);

        if (!token) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;