import React from 'react';
import {
  Container,
  Content,
  Form,
  Label,
  Item,
  Input
 } from 'native-base';


import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import ReduxActions from "../redux/actions";

import LogoutButton from '../components/LogoutButton';
import SpinnerLoader from '../components/SpinnerLoader';

class ProfileScreen extends React.Component {
  state = {
    currentUser: null
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    let { state } = this.props;
    this.setState({currentUser: state.currentUser.data})
  }

  render() {
    const { state } = this;
    if(state.currentUser){
      return (
        <Container>
          <Content padder>
            <Form>
              <Item stackedLabel>
                <Label>Nome</Label>
                <Input disabled={true}>
                  {state.currentUser.name}
                </Input>
              </Item>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input disabled={true}>
                  {state.currentUser.email}
                </Input>
              </Item>
            </Form>
            <LogoutButton />
          </Content>
        </Container>
      );
    } else{
      return <SpinnerLoader />
    }
  }
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser
    }
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.userActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
