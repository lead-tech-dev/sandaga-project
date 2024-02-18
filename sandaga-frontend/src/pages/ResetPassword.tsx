import React, {FunctionComponent, useEffect} from 'react';
import Form from "../components/Form";
import {FormDataInterface} from "../interfaces/form.interface";
import {AuthData} from "../data/data";
import {State} from "../redux/types";
import {Dispatch} from "redux";
import {resetPasswordUser} from "../redux/actions/auth.actions";
import {connect, ConnectedProps} from "react-redux";
import {useNavigate} from "react-router-dom";

const ResetPassword: FunctionComponent<ResetPasswordProps> = ({auth: {loading, errors, reset_password, reset_token, success}, resetPasswordUser}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(!reset_password) {
            navigate("/login", {replace: true})
        }

        return () => {
           // dispatch({type: GlobalsActionTypes.CLEAR_ERRORS});
        }
    }, [reset_password])
    const handleSubmit = (data: FormDataInterface) => {

        resetPasswordUser({...data, token: reset_token})
    }



    return (
        <Form handleSubmitData={(data) => handleSubmit(data)} fields={AuthData[3]} loading={loading} errors={errors} success={success}/>
    )
}
const mapStateToProps = (state: State) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    resetPasswordUser: (credentials: FormDataInterface) => dispatch(resetPasswordUser(credentials))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ResetPasswordProps = ConnectedProps<typeof connector>;

export default connector(ResetPassword)
