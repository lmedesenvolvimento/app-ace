import React from 'react';
import { View, Alert } from 'react-native';

import * as _ from 'lodash';

import numeral from 'numeral';

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
    a1: 0,
    a2: 0,
    b:  0,
    c:  0,
    d1: 0,
    d2: 0,
    e:  0,
    total_items: 0,
    collected: 0,
    removed: 0,
    start_number: '',
    end_number: '',
    validation:{
      start_number: false,
      end_number: false
    }
  }

  constructor(props){
    super(props);
  }

  componentWillMount(){    
    let { address } = this.props;
    if(address){
      this.setState({ ...address.visit.inspect, ...address.visit.sample })
    }
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
                    <Item floatingLabel>
                      <Label>A1</Label>
                      <Input 
                        keyboardType='numeric' 
                        value={this.state.a1.toString()} 
                        onChangeText={(a1) => this.setState({a1})}
                        onBlur={this.onBlurNumeralState.bind(this,'a1')} />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel>
                      <Label>A2</Label>
                      <Input 
                        keyboardType='numeric' value={this.state.a2.toString()} 
                        onChangeText={(a2) => this.setState({a2})}
                        onBlur={this.onBlurNumeralState.bind(this,'a2')} />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel>
                      <Label>B</Label>
                      <Input 
                        keyboardType='numeric'
                        value={this.state.b.toString()}
                        onChangeText={(b) => this.setState({b})}              
                        onBlur={this.onBlurNumeralState.bind(this,'b')} />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel>
                      <Label>C</Label>
                      <Input 
                        keyboardType='numeric'
                        value={this.state.c.toString()}
                        onChangeText={(c) => this.setState({c})}              
                        onBlur={this.onBlurNumeralState.bind(this,'c')} />                      
                    </Item>
                  </Col>
                </Grid>
                <Grid>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel>
                      <Label>D1</Label>
                      <Input 
                        keyboardType='numeric'
                        value={this.state.d1.toString()}
                        onChangeText={(d1) => this.setState({d1})}              
                        onBlur={this.onBlurNumeralState.bind(this,'d1')} />                      
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel>
                      <Label>D2</Label>
                      <Input 
                        keyboardType='numeric'
                        value={this.state.d2.toString()}
                        onChangeText={(d2) => this.setState({d2})}              
                        onBlur={this.onBlurNumeralState.bind(this,'d2')} />
                    </Item>
                  </Col>
                  <Col style={{ width: 64 }}>
                    <Item floatingLabel>
                      <Label>E</Label>
                      <Input 
                        keyboardType='numeric'
                        value={this.state.e.toString()}
                        onChangeText={(e) => this.setState({e})}              
                        onBlur={this.onBlurNumeralState.bind(this,'e')} />
                    </Item>
                  </Col>
                </Grid>

                <Grid>
                  <Col>
                    <Item floatingLabel>
                      <Label>Inspecionados</Label>
                      <Input value={this.state.total_items.toString()} keyboardType='numeric' disabled={true}/>
                    </Item>
                  </Col>
                  <Col>
                    <Item floatingLabel>
                      <Label>Eliminados</Label>
                      <Input 
                        keyboardType='numeric' 
                        value={this.state.removed.toString()} 
                        onChangeText={(removed) => this.setState({removed} )}
                        onBlur={this.onBlurNumeralState.bind(this, 'removed')}
                      />
                    </Item>
                  </Col>
                </Grid>

                <Grid>
                  <Col>
                    <Text style={[Layout.marginHorizontal, { color: Colors.primaryColor, marginTop: 16 }]}>Amostras</Text>
                  </Col>
                </Grid>                           

                <Grid>
                  <Col>
                    <Item floatingLabel error={this.state.validation.start_number}>
                      <Label>Início</Label>
                      <Input 
                        keyboardType='numeric' 
                        value={ this.state.start_number ? this.state.start_number.toString() : undefined } 
                        onChangeText={(start_number) => this.setState({start_number} )}
                        onBlur={this.onBlurNumeralState.bind(this, 'start_number')}
                      />
                    </Item>
                  </Col>
                  <Col>
                    <Item floatingLabel error={this.state.validation.end_number}>
                      <Label>Fim</Label>
                      <Input 
                        keyboardType='numeric' 
                        value={ this.state.end_number ? this.state.end_number.toString() : undefined}  
                        onChangeText={(end_number) => this.setState({end_number} )}
                        onBlur={this.onBlurNumeralState.bind(this, 'end_number')}
                      />
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
      this.state.validation.end_number
        ? Alert.alert('Falha na Validação', 'O número fim não pode ser menor que o número início.')
        : Alert.alert('Falha na Validação', 'Por favor cheque se todos os campos estão preenchidos.')
      
    } else{
      // Pass form value parent component
      let state = _.omit(this.state,['validation'])
      this.props.onSubmit(state)
      // Next step
      this.props.scrollBy(1)
    }
  }

  onBlurNumeralState(key){
    let number = numeral(this.state[key]).value()
    let updates = {}

    updates[key] = Math.abs(number)

    this.setState(updates)
    this.calcInspectionItens();
  }

  isInvalid(){
    const { start_number, end_number } = this.state;

    this.state.validation = {
      start_number: _.isEmpty(start_number.toString()),
      end_number: this.isInvalidEndNumber(start_number, end_number)
    }

    // Update view
    this.setState({
      validation: this.state.validation
    });

    // Verify if all states has present
    return _.values(this.state.validation).includes(true)
  }

  calcInspectionItens(){
    setTimeout(
      () => {
        let { a1, a2, b, c, d1, d2, e } = this.state;
        let total_items = _.sum([
          _.toInteger(a1),
          _.toInteger(a2),
          _.toInteger(b),
          _.toInteger(c),
          _.toInteger(d1),
          _.toInteger(d2),
          _.toInteger(e)
        ]);

        this.setState({total_items});
    }, 200);
  }

  isInvalidEndNumber(start_number, end_number){
    return _.isEmpty(start_number) && _.isEmpty(end_number) && (start_number >= end_number)
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
