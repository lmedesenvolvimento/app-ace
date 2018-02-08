import React from 'react';
import { View } from 'react-native';

import {
  Header,
  Container,
  Content,
  H2,
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

import StringMask from 'string-mask';
import moment from 'moment';

import Theme from '../../../constants/Theme';
import Layout from '../../../constants/Layout';

import { simpleToast } from '../../../services/Toast';

export class LocationForm extends React.Component {
  state = {
    startDate: moment().format('HH:mm')
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <Container>
        <Content padder>
          <Form>
            <H2 style={Layout.padding}>Localização</H2>

            <View style={Layout.row}>
              <View style={styles.col3}>
                <Item floatingLabel>
                  <Label>Logradouro</Label>
                  <Input/>
                </Item>
              </View>
              <View style={styles.container}>
                <Item floatingLabel>
                  <Label>Número</Label>
                  <Input keyboardType='numeric' />
                </Item>
              </View>
            </View>

            <View style={Layout.row}>
              <View style={styles.container}>
                <Item floatingLabel>
                  <Label>Quarteirão</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </View>
              <View style={styles.col3}>
                <Item floatingLabel>
                  <Label>Complemento</Label>
                  <Input />
                </Item>
              </View>
            </View>

            <View style={Layout.row}>
              <View style={styles.container}>
                <Item floatingLabel>
                  <Label>Entrada</Label>
                  <Input
                    value={this.state.startDate}
                    keyboardType='numeric'
                    onChangeText={ (startDate) => this.applyStartDateMask(startDate) } />
                </Item>
              </View>

              <View style={styles.col3}>
                <Item floatingLabel>
                  <Label>Tipo de Imóvel</Label>
                  <Input />
                </Item>
              </View>
            </View>

            <View style={Layout.row}>
              <View style={[styles.container, Layout.padding]}>
                <Label>Pendência</Label>
                <Picker
                  iosHeader="Selecione um"
                  mode="dropdown">
                  <Item label="Sim" value='true' />
                  <Item label="Não" value='false' />
                </Picker>
              </View>
            </View>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Right>
            <Button transparent onPress={ () => this.props.scrollBy(1) }>
              <Text>Avançar</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    );
  }

  applyStartDateMask(startDate){
    startDate = startDate.replace(':','')
    let result = new StringMask("00:00").apply(startDate)
    this.setState({ startDate: result })
  }
}

const styles = {
  container: {
    flex: 1
  },
  col3:{
    flex: 2.2
  }
}
