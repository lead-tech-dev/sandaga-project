import React, {Fragment, FunctionComponent} from 'react';
import {FormDataInterface} from "../../../interfaces/form.interface";
import {State} from "../../../redux/types";
import {Dispatch} from "redux";
import {signupUser} from "../../../redux/actions/auth.actions";
import {connect, ConnectedProps} from "react-redux";
import {AuthData} from "../../../data/data";
import Form from "./Form";
import {useSearchParams} from "react-router-dom";


const MyAccount: FunctionComponent<MyAccountProps> = ({auth: {loading, errors, credentials},images: {image_loading} }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get("code")
    const handleSubmit = (data: any) => {}

    return(

        <Fragment>
            <Form fields={AuthData[8]} loading={loading} handleSubmitData={(data) => handleSubmit(data)}/>
            <Form  fields={AuthData[4]}  loading={loading} handleSubmitData={(data) => handleSubmit(data)}/>
            <Form  fields={AuthData[5]} loading={loading} handleSubmitData={(data) => handleSubmit(data)}/>
            <Form fields={code ? AuthData[7] : AuthData[6]} loading={loading} handleSubmitData={(data) => handleSubmit(data)}  />
            <Form fields={AuthData[9]}  loading={loading} handleSubmitData={(data) => handleSubmit(data)} />
        </Fragment>
    );
}

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    images: state.images
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    signupUser: (credentials: FormDataInterface) => dispatch(signupUser(credentials))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type MyAccountProps = ConnectedProps<typeof connector>;

export default connector(MyAccount)