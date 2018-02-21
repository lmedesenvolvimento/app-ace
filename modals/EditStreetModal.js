import React from 'react';
import { View} from 'react-native';

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

import { NewStreetModal } from './NewStreetModal';


import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

class EditStreetModal extends NewStreetModal {
  state = {
    address: undefined,
    neighborhood: {},
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ neighborhood: this.props.fieldgroup.neighborhood, ...this.props.publicarea })
  }

  dismissModalBeforeModal(){
    Actions.pop({publicarea: this.state});

    setTimeout(() => {
      Actions.refresh({publicarea: this.state});
    });
  }

  okModal(){
    if(!this.state.address){
      return simpleToast("Logradouro vazio.")
    }
    
    this.props.editPublicArea(this.props.fieldgroup.$id, this.props.publicarea, this.state)

    this.dismissModalBeforeModal()
  }

  render() {
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Atualizar Logradouro</H1>
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
              <Text>Atualizar</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditStreetModal);
