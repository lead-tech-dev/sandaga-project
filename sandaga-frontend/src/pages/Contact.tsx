import React, {FunctionComponent} from 'react';
import SectionTitle from "../components/section-title/section-title";
import Form from "../components/Form";
import {AuthData} from "../data/data";
import {State} from "../redux/types";
import {Dispatch} from "redux";
import {FormDataInterface} from "../interfaces/form.interface";
import {contact, loginUser} from "../redux/actions/auth.actions";
import {connect, ConnectedProps} from "react-redux";

const Contact:FunctionComponent<ContactProps> = ({auth: { contact_loading, errors, contact_success}, contact}) => {
    const handleSubmit = (data: any) => {
        data.type = "Anonymous";
        contact(data)
    }
    return (
        <Form fields={AuthData[10]} errors={errors} loading={contact_loading} handleSubmitData={(data) => handleSubmit(data)} success={contact_success}/>
    );
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    contact: (data: {firstname: string, lastname: string; raison: string, email: string, message: string}) => dispatch(contact(data))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactProps = ConnectedProps<typeof connector>;

export default connector(Contact)