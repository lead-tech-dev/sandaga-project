import { useLocation, Navigate, Outlet } from "react-router-dom";

import {FunctionComponent} from "react";
import {State} from "../redux/types";
import {connect, ConnectedProps} from "react-redux";



const NotAuthRoute: FunctionComponent<NotAuthRouteProps> = ({auth: {authenticated}}) => {
    const location = useLocation();

    return (
        authenticated
                ? <Navigate to="/" state={{ from: location }} replace />
                : <Outlet/>
    );
}

const mapStateToProps = (state: State) => ({
    auth: state.auth,
})

const connector = connect(mapStateToProps, null);

type NotAuthRouteProps = ConnectedProps<typeof connector>;

export default connector(NotAuthRoute)