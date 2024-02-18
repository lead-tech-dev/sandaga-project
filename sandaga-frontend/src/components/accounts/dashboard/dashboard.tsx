import React, {FunctionComponent, useEffect, useState, MouseEvent} from 'react';
import "./dashboard.style.scss";
import StripeButton from "../../../assets/images/others/stripeButton.png";
import {Link, useNavigate} from "react-router-dom";
import {State} from "../../../redux/types";
import {Dispatch} from "redux";
import {logoutUser} from "../../../redux/actions/auth.actions";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {
    ADS_IMAGE_URL,
    FAVORITES_URL,
    getRefreshToken,
    headersWithAuthorization,
    NOTIFICATIONS_URL
} from "../../../hooks/useConfig";
import Button from "../../Button";
import {stripeDelete, stripeUpdate} from "../../api/api-user";
import {AuthActionTypes} from "../../../redux/types/auth.type";
import Notification from "../../notifications/notification";

export interface NotificationsProps {
    id: string;
    message: string;
    status: string;
    createdAt: Date
}

const Dashboard: FunctionComponent<DashboardProps> = ({auth: { credentials }, logoutUser}) => {
    const [notifications, setNotifications] = useState<NotificationsProps[] | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingNotification, setLoadingNotification] = useState<boolean>(true);
    const [loadingDelNotification, setLoadingDelNotification] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        apiGetUserNotifications();
    }, []);

    const handleLogout = async (e: any) => {
        e.preventDefault();
        logoutUser && logoutUser({ refreshToken: getRefreshToken() })

        navigate("/", { replace: true });
    };

    const handleDeleteStripeUser = (e: any) => {
        e.preventDefault();

        setLoading(true);
        stripeDelete().then((res: any) => {
            if (!res.success) {
                setLoading(false);
                setError(true);
                setMessage("Impossible de supprimer votre compte Stripe. Réessayez plus tard.")
            } else {
                setLoading(false);
                setError(false);
                setMessage("Votre compte Stripe supprimé avec succès !")

                dispatch({
                    type: AuthActionTypes.DELETE_STRIPE_USER_ID
                })
            }
        })
    }

    const apiGetUserNotifications = () => {
        fetch(NOTIFICATIONS_URL, {
            method: "GET",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    console.log(credentials["userId"])
                    setNotifications(json)
                    setLoadingNotification(false)
                }else {
                    setNotifications(null)
                    setLoadingNotification(false)
                }
            })
            .catch((err) => {
                setLoadingNotification(false)
                console.log(err);
            });

    }

    const apiDeleteUserNotifications = (id: string) => {
        setLoadingDelNotification(true);
        fetch(NOTIFICATIONS_URL + "/" + id, {
            method: "PUT",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    const currentIndex = notifications?.findIndex(item => item.id === id);

                    if (notifications && currentIndex && currentIndex !== - 1) {
                        notifications[currentIndex].status = "read";
                        setNotifications(notifications);
                    }
                    setLoadingDelNotification(false)
                }else {
                    setNotifications(null)
                    setLoadingDelNotification(false)
                }
            })
            .catch((err) => {
                setLoadingDelNotification(false)
                console.log(err);
            });

    }
    const deleteNotification = (e: MouseEvent<SVGSVGElement>, id: string)=>  {
        e.preventDefault();

        apiDeleteUserNotifications(id);
    }

    return (
        <div className="dashboard-wrapper">
            <div className="auth-details">
                <div className="profile-wrapper">
                    <div className="img">
                        <img src={`${credentials && credentials["image"] ? ADS_IMAGE_URL + credentials["image"]["name"] : "/assets/images/svg/avatar.svg" }`}/>
                    </div>
                    <div className="paymentLeft">
                        <h3>{credentials && credentials["firstname"]} {credentials && credentials["lastname"]}</h3>
                        <span>{credentials && credentials["email"]}</span>
                    </div>
                </div>
                <div className="stripe-wrapper">
                    {credentials && credentials["stripe_user_id"] ? (
                            <Button type="button" className="btn btn-primary" onClick={() => console.log("")} label="Stripe connecté" disabled={true}/>

                        ): (
                        <Link
                            to={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_P9LBNEw8GZN5wSPV4eS1UHHqspguUqsR&scope=read_write`}
                            className="stripe_connect">
                            <img src={StripeButton}/>
                            <div className="info">
                                <i className="fa fa-question-circle">
                                     <span className="info-text">
                                         Stripe connect vous permettra de recevoire
                                         le produit de vos ventes sur Sandaga.
                                     </span>
                                </i>

                            </div>
                        </Link>
                    )}
                    {credentials && credentials["stripe_user_id"] && (
                        <div className="action">
                            <Link
                                to={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_P9LBNEw8GZN5wSPV4eS1UHHqspguUqsR&scope=read_write`}>
                                <i className="fa fa-pencil"/>
                            </Link>
                            <button disabled={loading} onClick={(e) => handleDeleteStripeUser(e)}>
                                <i className="fa fa-trash"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="content">
                {loadingNotification ? "loading..." :
                    notifications && notifications.length > 0 ?
                        notifications
                            .filter(notification => notification.status !== "read")
                            .reverse()
                            .map((notification, index) => (
                            <Notification notification={notification} handleDeleteNotification={(e, id) => deleteNotification(e, id)}/>
                        )): <p>Vous n'avez reçu aucune notification!</p>
                }
            </div>
            <div className="footer">
                <Button type="button" className="btn btn-secondary" onClick={handleLogout} label="Deconnexion"/>
            </div>
        </div>
    );
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    logoutUser: (refreshToken: any) => dispatch(logoutUser(refreshToken)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type DashboardProps = ConnectedProps<typeof connector>;

export default connector(Dashboard);