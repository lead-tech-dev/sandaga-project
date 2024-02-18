import React, {Fragment, FunctionComponent} from 'react';
import {useParams} from "react-router-dom";

import InBox from "../../in-box/in-box";

interface MessengerProps {

}
const Messenger: FunctionComponent<MessengerProps> = ({}) => {
    const param = useParams();

    return(
        <div className="account-listing">
            {param.messageId === undefined ? (
                <Fragment>
                    <InBox/>
                </Fragment>
            ) : <InBox id={param.messageId ? param.messageId : ""}/>}
        </div>
    );
}

export default Messenger;