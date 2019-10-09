import React from 'react';

import _ from 'lodash';

import numeral from 'numeral';

import {
  Container,
  Content,
  H2,
  Text,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Button
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import TimerMixin from 'react-timer-mixin';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

import { StepBars, Step } from './StepBars';

import { simpleToast } from '../../../services/Toast'

export class InspectionForm extends React.Component {  
  constructor(props){
    super(props);

    this.inputs = {};
    this.state = {
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
      processing: false,
      focused: false,
    };

  }
  componentWillMount(){    
    let { payload } = this.props;
    if(payload && payload.visit){
      this.setState({ ...payload.visit.inspect, ...payload.visit.sample });
    }
  }

  render(){
    return (
      <Container>
        <Content padder>
          <Form>
            <StepBars>
              <Step complete={true}></Step>
              <Step active={true}></Step>
              <Step></Step>
              <Step></Step>
              <Step></Step>
            </StepBars>

            <H2 style={Layout.padding}>Inspeção de coleta de larvas</H2>
            <Text style={[Layout.marginHorizontal, { color: Colors.primaryColor }]}>Nº de depósitos inspecionados por tipo:</Text>

            <Grid>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>A1</Label>
                  <Input                                    
                    keyboardType='numeric' 
                    onChangeText={(a1) => this.setState({a1})}
                    onFocus={this.onFocus}
                    onBlur={() => this.onBlurNumeralState('a1')}
                    onSubmitEditing={() => this.onBlurNumeralState('a1', 'a2')}
                  >
                    {this.state.a1.toString()} 
                  </Input>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>A2</Label>
                  <Input
                    ref={ref => this.inputs.a2 = ref} 
                    keyboardType='numeric'
                    onChangeText={(a2) => this.setState({a2})}
                    onFocus={this.onFocus}
                    onBlur={() => this.onBlurNumeralState('a2')} 
                    onSubmitEditing={() => this.onBlurNumeralState('a2', 'b')}
                  >
                    { this.state.a2.toString() } 
                  </Input>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>B</Label>
                  <Input 
                    ref={ref => this.inputs.b = ref} 
                    keyboardType='numeric'
                    onFocus={this.onFocus}
                    onChangeText={(b) => this.setState({b})}
                    onBlur={() => this.onBlurNumeralState('b')} 
                    onSubmitEditing={() => this.onBlurNumeralState('b', 'c')}
                  >
                    {this.state.b.toString()}
                  </Input>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>C</Label>
                  <Input
                    ref={ref => this.inputs.c = ref}  
                    keyboardType='numeric'
                    onFocus={this.onFocus}
                    onChangeText={(c) => this.setState({c})}
                    onBlur={() => this.onBlurNumeralState('c')} 
                    onSubmitEditing={() => this.onBlurNumeralState('c', 'd1')}
                  >
                    {this.state.c.toString()}              
                  </Input>
                </Item>
              </Col>
            </Grid>
            <Grid>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>D1</Label>
                  <Input
                    ref={ref => this.inputs.d1 = ref}
                    keyboardType='numeric'
                    onFocus={this.onFocus}
                    onChangeText={(d1) => this.setState({d1})}
                    onBlur={() => this.onBlurNumeralState('d1')} 
                    onSubmitEditing={() => this.onBlurNumeralState('d1', 'd2')}
                  >       
                    {this.state.d1.toString()}               
                  </Input>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>D2</Label>
                  <Input
                    ref={ref => this.inputs.d2 = ref}
                    keyboardType='numeric'
                    onFocus={this.onFocus}
                    onChangeText={(d2) => this.setState({d2})}
                    onBlur={() => this.onBlurNumeralState('d2')} 
                    onSubmitEditing={() => this.onBlurNumeralState('d2', 'e')}
                  >
                    {this.state.d2.toString()}
                  </Input>
                </Item>
              </Col>
              <Col style={{ width: 64 }}>
                <Item stackedLabel>
                  <Label>E</Label>
                  <Input
                    ref={ref => this.inputs.e = ref}
                    keyboardType='numeric'
                    onFocus={this.onFocus}
                    onChangeText={(e) => this.setState({e})}
                    onBlur={() => this.onBlurNumeralState('e')} 
                  >
                    {this.state.e.toString()}
                  </Input>
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col>
                <Item stackedLabel>
                  <Label>Inspecionados</Label>
                  <Input 
                    keyboardType='numeric' 
                    disabled={true}
                  >
                    {this.state.total_items.toString()}
                  </Input>
                </Item>
              </Col>
              <Col>
                <Item stackedLabel>
                  <Label>Eliminados</Label>
                  <Input 
                    keyboardType='numeric' 
                    onFocus={this.onFocus}
                    onChangeText={(removed) => this.setState({removed} )}
                    onBlur={() => this.onBlurNumeralState('removed')}
                  >
                    {this.state.removed.toString()}
                  </Input>
                </Item>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor: '#FFFFFF'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent disabled={this.state.busy} onPress={this.onCancel.bind(this)}>
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
                <Button full transparent disabled={this.state.busy} onPress={this.onSubmit.bind(this) }>
                  <Text>Avançar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Footer>
      </Container>
    );
  }

  toObservation() {
    return this.props.scrollBy(3);
  }

  onSubmit(){
    if (this.state.focused) {
      return simpleToast('Preencha todos os campos.');
    }
    
    if(this.state.processing || this.state.focused) return;

    this.setState({ processing: true });
    
    TimerMixin.requestAnimationFrame(this._onSubmit.bind(this));
  }
  
  _onSubmit(){
    const omitedAtributes = ['validation','processing'];
    // Pass form value parent component
    let state = _.omit(this.state, omitedAtributes);
    
    if (!state.total_items && !state.removed) {
      state.backTo = 'inspections';
      
      // Otimize swipper transition
      this.props.onSubmit(state, () => {
        this.setState({ processing: false });
        // go to observation
        this.toObservation();
      });
    } else {
      // Otimize swipper transition
      this.props.onSubmit(state, () => {
        this.setState({ processing: false });
        // Next step
        this.props.scrollBy(1);
      });
    }
  }
  
  onCancel(){
    if(this.state.processing) return;
    this.props.scrollBy(-1);
  }

  onFocus = () => {
    this.setState({ focused: true })
  }

  onBlurNumeralState = (key, nextInput) => {
    let number = numeral(this.state[key]).value();
    let updates = { focused: false };

    updates[key] = Math.abs(number);

    this.setState(updates);
    this.calcInspectionItens();

    if (nextInput) this.inputs[nextInput]._root.focus();
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
      } , 200);
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
    borderLeftColor: '#eee'
  },
  lastField: {
    paddingBottom: 48
  }
};
