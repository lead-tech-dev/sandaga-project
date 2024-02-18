import React from "react";
import {loginUser} from "../redux/actions/auth.actions";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {State} from "../redux/types"
import {AuthData} from "../data/data";
import {FormDataInterface} from "../interfaces/form.interface";
import Form from "../components/Form";

const Signin: React.FC<SigninProps> = ({auth: { loading, errors}, loginUser}) => {

  const handleSubmit =  (data: FormDataInterface) => {
     loginUser(data)

  }
  return (
      <Form fields={AuthData[1]} errors={errors} loading={loading} handleSubmitData={(data) => handleSubmit(data)} />
  );
};


const mapStateToProps = (state: State) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  loginUser: (credentials: FormDataInterface) => dispatch(loginUser(credentials))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type SigninProps = ConnectedProps<typeof connector>;

export default connector(Signin)
