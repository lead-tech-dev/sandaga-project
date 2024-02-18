import { useLocation, Navigate, Outlet } from "react-router-dom";

import {FunctionComponent} from "react";
import {State} from "../redux/types";
import {connect, ConnectedProps} from "react-redux";

interface AllowedRolesProps {
    allowedRoles: string[]
}

const AuthRoute: FunctionComponent<AuthRouteProps & AllowedRolesProps> = ({ auth: {authenticated, role}, allowedRoles }) => {

    const location = useLocation();

    return (
        authenticated && allowedRoles?.includes(role)
            ? <Outlet />
            : authenticated
                ? <Navigate to="/"  replace />
                : <Navigate to="/login"  state={{ from: location }} replace />
    );
}


const mapStateToProps = (state: State) => ({
    auth: state.auth
})

const connector = connect(mapStateToProps, null);

type AuthRouteProps = ConnectedProps<typeof connector >;

export default connector(AuthRoute)