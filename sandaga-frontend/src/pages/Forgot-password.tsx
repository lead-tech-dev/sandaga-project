import React, {FunctionComponent} from "react";
import Form from "../components/Form";
import {AuthData} from "../data/data";
import {FormDataInterface} from "../interfaces/form.interface";
import {State} from "../redux/types";
import {Dispatch} from "redux";
import {forgotPasswordUser} from "../redux/actions/auth.actions";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = ({auth: {loading, errors, success}, forgotPasswordUser}) => {



  const handleSubmit =  (data: FormDataInterface) => {

    forgotPasswordUser(data)

  }

  return (
      <Form handleSubmitData={(data) => handleSubmit(data)} fields={AuthData[2]} loading={loading} errors={errors} success={success} />

  );
};

const mapStateToProps = (state: State) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  forgotPasswordUser: (credentials: FormDataInterface) => dispatch(forgotPasswordUser(credentials))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ForgotPasswordProps = ConnectedProps<typeof connector>;

export default connector(ForgotPassword)
