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

import { Col, Row, Grid } from "react-native-easy-grid";

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

            <Grid>
              <Col size={66}>
                <Item floatingLabel>
                  <Label>Logradouro</Label>
                  <Input/>
                </Item>
              </Col>
              <Col size={33}>
                <Item floatingLabel>
                  <Label>Número</Label>
                  <Input keyboardType='numeric' />
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col size={33}>
                <Item floatingLabel>
                  <Label>Quarteirão</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col size={66}>
                <Item floatingLabel>
                  <Label>Complemento</Label>
                  <Input />
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col size={33}>
                <Item floatingLabel>
                  <Label>Entrada</Label>
                  <Input
                    value={this.state.startDate}
                    keyboardType='numeric'
                    onChangeText={ (startDate) => this.applyStartDateMask(startDate) } />
                </Item>
              </Col>
              <Col size={66}>
                <Item floatingLabel>
                  <Label>Tipo de Imóvel</Label>
                  <Input />
                </Item>
              </Col>
            </Grid>

            <Grid style={Layout.padding}>
              <Col>
                <Label>Pendência</Label>
                <Picker
                  iosHeader="Selecione um"
                  mode="dropdown">
                  <Item label="Sim" value='true' />
                  <Item label="Não" value='false' />
                </Picker>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={ () => this.props.cancel() }>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col style={[styles.col, styles.colLeftBorder]}>
                <Button full transparent onPress={ () => this.props.scrollBy(1) }>
                  <Text>Avançar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
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
  col:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  colLeftBorder:{
    borderLeftWidth: 1,
    borderLeftColor: "#eee"
  }
}
