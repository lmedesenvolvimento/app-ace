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

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class NewZoneModal extends React.Component {
  state = {
    street: undefined,
    neighborhood: undefined
  }

  neighborhoods = ['Aldeota','Bairro de Fátima','Messejana','Parque Araxá','Jacarecanga']

  constructor(props) {
    super(props);
  }

  dismissModal(){
    Actions.pop()
  }

  render() {
    return (
      <Container>
        <Content padder>
          <H1 style={Layout.padding}>Novo Logradouro</H1>
          <Form>
            <View style={Layout.padding}>
              <Label>Selecione um Bairro</Label>
              <Picker
                mode="dropdown"
                iosHeader="Selecione um bairro"
                placeholder="Selecione um bairro"
                selectedValue={this.state.neighborhood}
                onValueChange={(neighborhood)=> this.setState({ neighborhood })}>
                  { this.renderNeighborhoodsItems() }
              </Picker>
            </View>

            <Item stackedLabel>
              <Label>Logradouro</Label>
              <Input placeholder="Nome do Logradouro"/>
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
            <Button transparent onPress={this.dismissModal}>
              <Text>Novo Logradouro</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    );
  }

  renderNeighborhoodsItems(){
    return this.neighborhoods.map((n, index) => {
      return (
        <Item label={n} value={n} key={index} />
      );
    })
  }
}


export default connect(({currentUser}) => ({network, currentUser}))(NewZoneModal);
