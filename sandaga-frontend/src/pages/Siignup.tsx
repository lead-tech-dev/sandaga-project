import React, {FunctionComponent} from "react";
import {AuthData} from "../data/data";
import {State} from "../redux/types";
import {Dispatch} from "redux";
import {signupUser} from "../redux/actions/auth.actions";
import {connect, ConnectedProps} from "react-redux";
import Form from "../components/Form";
import {FormDataInterface} from "../interfaces/form.interface";
const Signup: FunctionComponent<SignupProps> = ({auth: {loading, errors, success},  signupUser}) => {

    const handleSubmit = (data: FormDataInterface) => {
        data.accountType = "1";
        signupUser(data)
    }
    return (
    <Form fields={AuthData[0]} errors={errors} loading={loading} handleSubmitData={(data) => handleSubmit(data)} success={success} />

    );
};
const mapStateToProps = (state: State) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    signupUser: (credentials: FormDataInterface) => dispatch(signupUser(credentials))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type SignupProps = ConnectedProps<typeof connector>;

export default connector(Signup)