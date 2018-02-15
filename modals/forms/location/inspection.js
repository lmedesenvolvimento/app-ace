import React from 'react';
import { View, Alert } from 'react-native';

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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import StringMask from 'string-mask';
import moment from 'moment';

import Colors from '../../../constants/Colors';
import Theme from '../../../constants/Theme';
import Layout from '../../../constants/Layout';

import { simpleToast } from '../../../services/Toast';

import { StepBars, Step } from './StepBars';

export class InspectionForm extends React.Component {
  state = {
    validation: {
      a1: false,
      a2: false,
      b:  false,
      c:  false,
      d1: false,
      d2: false,
      e:  false,
    }
  }

  constructor(props){
    super(props);
    this._focusNextField = this._focusNextField.bind(this);
  }

  render(){
    return (
      <Container>
        <KeyboardAwareScrollView>
          <Content padder>
              <Form>
                <StepBars>
                  <Step complete={true}></Step>
                  <Step active={true}></Step>
                  <Step></Step>
                  <Step></Step>
                </StepBars>

                <H2 style={Layout.padding}>Inspeção de coleta de larvas</H2>
                <Text style={[Layout.marginHorizontal, { color: Colors.primaryColor }]}>Nº de depósitos inspecionados por tipo:</Text>

                <Grid>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.a1}>
                      <Label>A1</Label>
                      <Input
                        ref="a1"
                        keyboardType='numeric'
                        value={this.state.a1}
                        onChangeText={ (a1) =>  this.setState({a1}) } />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.a2}>
                      <Label>A2</Label>
                      <Input
                        ref="a2"
                        keyboardType='numeric'
                        value={this.state.a2}
                        onChangeText={ (a2) =>  this.setState({a2}) } />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.b}>
                      <Label>B</Label>
                      <Input ref="b" keyboardType='numeric' value={this.state.b} onChangeText={ (b) =>  this.setState({b}) } />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.c}>
                      <Label>C</Label>
                      <Input keyboardType='numeric' value={this.state.c} onChangeText={ (c) =>  this.setState({c}) } />
                    </Item>
                  </Col>
                </Grid>
                <Grid>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.d1}>
                      <Label>D1</Label>
                      <Input keyboardType='numeric' value={this.state.d1} onChangeText={ (d1) =>  this.setState({d1}) } />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.d2}>
                      <Label>D2</Label>
                      <Input keyboardType='numeric' value={this.state.d2} onChangeText={ (d2) =>  this.setState({d2}) } />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel error={this.state.validation.e}>
                      <Label>E</Label>
                      <Input keyboardType='numeric' value={this.state.e} onChangeText={ (e) =>  this.setState({e}) } />
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

                <Grid style={styles.lastField}>
                  <Col>
                    <Item floatingLabel>
                      <Label>Nº de depósitos eliminados</Label>
                      <Input keyboardType='numeric'/>
                    </Item>
                  </Col>
                </Grid>
              </Form>
          </Content>
        </KeyboardAwareScrollView>
        <Footer style={{backgroundColor:"white"}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={ () => this.props.scrollBy(-1) }>
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
                <Button full transparent onPress={ () => this.onSubmit() }>
                  <Text>Avançar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Footer>
      </Container>
    );
  }

  onSubmit(){
    if(this.isInvalid()){
      Alert.alert('Falha na Validação', 'Por favor cheque se todos os campos estão preenchidos.')
    } else{
      this.props.scrollBy(1)
    }
  }

  isInvalid(){
    const { a1, a2, b, c, d1, d2, e } = this.state;

    this.state.validation = {
      a1: _.isEmpty(a1),
      a2: _.isEmpty(a2),
      b:  _.isEmpty(b),
      c:  _.isEmpty(c),
      d1: _.isEmpty(d1),
      d2: _.isEmpty(d2),
      e:  _.isEmpty(e)
    }

    // Update view
    this.setState({
      validation: this.state.validation
    });

    // Verify if all states has present
    return _.values(this.state.validation).includes(true)
  }

  _focusNextField(nextField) {
    this.refs[nextField].focus()
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
  },
  lastField: {
    paddingBottom: 48
  }
}
