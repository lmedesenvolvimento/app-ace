import React from 'react';
import { View, TouchableHighlight } from 'react-native';

import {
  Header,
  Container,
  Content,
  H1,
  Text,
  Title,
  Left,
  Right,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Body,
  Button,
  Picker,
} from 'native-base';


import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

class NewZoneModal extends React.Component {
  state = {
    address: undefined,
    neighborhood: {}
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ neighborhood: this.props.zone.neighborhood })
  }

  okModal(){
    if(!this.state.address){
      return simpleToast("Logradouro vazio.")
    }
    this.props.addFieldGroup(this.props.zoneIndex, this.state)
    this.dismissModal()
  }

  dismissModal(){
    // Is nesscessary for prevent cache page
    Actions.pop({ refresh: { refresh: Math.random() }});
  }

  render() {
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Novo Logradouro</H1>
          <Form>
            <View style={Layout.padding}>
              <Label>Bairro</Label>
              <Input placeholder="Nome do Bairro" value={this.state.neighborhood.name} disabled={true}/>
            </View>

            <Item stackedLabel>
              <Label>Logradouro</Label>
              <Input placeholder="Nome do Logradouro" value={this.state.address} onChangeText={(address)=> this.setState({address})} />
            </Item>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Left>
            <Button transparent onPress={this.dismissModal}>
              <Text>Cancelar</Text>
            </Button>
          </Left>
          <Right>
            <Button transparent onPress={ () => this.okModal() }>
              <Text>Novo Logradouro</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser,
      fieldGroups: state.fieldGroups
    }
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewZoneModal);
