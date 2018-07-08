import React from 'react';

import {
  Header,
  Container,
  Content,
  H2,
  Text,
  Title,
  Left,
  Footer,
  Form,
  Label,
  Item,
  Input,
  Body,
  Button,
  Picker,
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import numeral from 'numeral';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

import { StepBars, Step } from './StepBars';

import { TreatmentType } from '../../../types/treatment';

export class TratamentForm extends React.Component {
  
  constructor(props){
    super(props);
    this.props.state = {};
    this.state = {
      type: 'larvicida_pyriproxyfen',
      quantity: 0.0,
      adulticida_quantity: 0.0
    };
  }

  componentWillMount(){    
    if(this.props.address && this.props.address.visit){
      this.setState({...this.props.address.visit.treatment})
    }
  }

  render(){
    return (
      <Container>
        <Content padder>
          <Form>
            <StepBars>
              <Step complete={true}></Step>
              <Step complete={true}></Step>
              <Step complete={true}></Step>
              <Step active={true}></Step>
              <Step></Step>
            </StepBars>

            <H2 style={Layout.padding}>Tratamento focal/perifocal</H2>
            <Text style={[Layout.marginHorizontal, { color: Colors.primaryColor }]}>Larvicída</Text>

            <Grid>
              <Col>
                <Item floatingLabel >
                  <Label>Nº de depósitos tratamentos</Label>
                  <Input 
                    keyboardType='numeric'
                    value={this.state.quantity.toString()}
                    onChangeText={(quantity) => this.setState({quantity})} 
                    onBlur={this.onBlurNumeralState.bind(this, 'quantity')} />
                </Item>
              </Col>
            </Grid>
            <Grid style={{ marginHorizontal: 12, marginTop: 24 }}>
              <Col>
                <Text note>Tipo de Código</Text>
                <Picker
                  selectedValue={this.state.type}
                  onValueChange={(type) => this.setState({ ...this.state, type: type})}
                  supportedOrientations={['portrait', 'landscape']}
                  iosHeader='Selecione um'
                  mode='dropdown'>
                    <Item label={TreatmentType.larvicida_pyriproxyfen} value={'larvicida_pyriproxyfen'} />
                    <Item label={TreatmentType.larvicida_spinosad} value={'larvicida_spinosad'} />
                </Picker>                
              </Col>
            </Grid>
            <Grid>
              <Col>
                <Item floatingLabel>
                  <Label>Larvicida gramas</Label>
                  <Input 
                    keyboardType='numeric'
                    value={this.state.adulticida_quantity.toString()}
                    onChangeText={(adulticida_quantity) => this.setState({adulticida_quantity})} 
                    onBlur={this.onBlurNumeralState.bind(this, 'adulticida_quantity')} />
                </Item>
              </Col>              
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:'white'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={ () => this.props.scrollBy(-1) }>
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
                <Button full transparent onPress={this.onSubmit.bind(this)}>
                  <Text>Avançar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Footer>
      </Container>
    );
  }

  updateQuantity(){
    number = numeral(this.state.quantity)
        
    if(number.value() > 0){
      this.setState({ quantity: number.value() })  
    } else{      
      this.setState({ quantity: ( number.value() * -1 ) })  
    }
  }


  onBlurNumeralState(key){
    let number = numeral(this.state[key]).value()
    let updates = {}

    updates[key] = Math.abs(number)

    this.setState(updates)
  }

  onSubmit(){
    // Pass form value parent component
    this.props.onSubmit(this.state)
    // Next Step
    this.props.scrollBy(1)
  }

  _renderPickerHeader(backAction){
    return(
      <Header>
        <Left style={styles.container}>
          <Button transparent onPress={backAction}>
            <Text>Voltar</Text>
          </Button>
        </Left>
        <Body style={{flex: 2}}>
          <Title style={{textAlign: 'center'}}>Selecione um</Title>
        </Body>
      </Header>
    )
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
  }
}
