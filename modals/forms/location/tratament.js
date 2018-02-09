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

export class TratamentForm extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Container>
        <Content padder>
          <Form>
            <H2 style={Layout.padding}>Tratamento focal/perifocal</H2>
            <Text style={[Layout.marginHorizontal, { color: Colors.primaryColor }]}>Larvicída</Text>

            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Nº de depósitos tratamentos</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>
            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Larvicida gotas</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
              <Col>
                <Item floatingLabel>
                  <Label>Larvicida ML</Label>
                  <Input keyboardType='numeric'/>
                </Item>
              </Col>
            </Grid>
            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Adulticida cargas</Label>
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
