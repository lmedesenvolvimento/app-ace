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

import Colors from '../../../constants/Colors';
import Theme from '../../../constants/Theme';
import Layout from '../../../constants/Layout';

import { simpleToast } from '../../../services/Toast';

export class InspectionForm extends React.Component {
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
            <H2 style={Layout.padding}>Inspeção de coleta de larvas</H2>
            <Text style={[Layout.marginHorizontal, { color: Colors.primaryColor }]}>Nº de depósitos inspecionados por tipo:</Text>

            <Grid>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>A1</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>A2</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>B</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>C</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>
            <Grid>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>D1</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>D2</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item floatingLabel>
                  <Label>E</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Nº de depósitos inspecionados</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Nº de amotras coletadas</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Nº de depósitos eliminados</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={ () => this.props.scrollBy(-1) }>
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
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
