import React, {FunctionComponent, MouseEvent} from 'react';
import Close from "../../assets/icons/Close";
import {NotificationsProps} from "../accounts/dashboard/dashboard";
import "./notification.style.scss";
interface NotificationProps {
    notification: NotificationsProps,
    handleDeleteNotification: (e: MouseEvent<SVGSVGElement>, id: string) => void
}
const Notification: FunctionComponent<NotificationProps> = ({notification, handleDeleteNotification}) => {
    return (
        <div className="notification-wrapper">
            <div className="notification-wrapper__inner">
                <span>{notification.message}</span>
                <div
                    className="notification-wrapper__close"
                >
                    <Close onClick={(e) => handleDeleteNotification(e, notification.id)}/>
                </div>
            </div>
        </div>
    );
};

export default Notification;