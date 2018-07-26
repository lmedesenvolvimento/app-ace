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

import Modal from '../../../components/Modal';

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
      adulticida_quantity: 0.0,
      modalIsVisible: false,
      bigSpoonpQuantity: 0.0,
      smallSpoonpQuantity: 0.0
    };
  }

  componentWillMount(){    
    if(this.props.address && this.props.address.visit){
      this.setState({...this.props.address.visit.treatment});
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
                  <Label>N de depósitos tratados</Label>
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
              <Row style={{ alignItems: 'flex-end' }}>
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
                <Col>
                  <Button onPress={this.openModal.bind(this)} primary transparent>
                    <Text>Calcular Quantidade</Text>
                  </Button>
                </Col>
              </Row>
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
        <Modal isVisible={this.state.modalIsVisible} onConfirm={this.onConfirm.bind(this)} onCancel={this.onCancel.bind(this)} title='Calcular quantidade'>
          <Content padder>
            <Form>
              <Item floatingLabel>
                <Label>Nº de colheres grandes</Label>
                <Input 
                  keyboardType='numeric'
                  value={this.state.bigSpoonpQuantity.toString()}
                  onChangeText={(bigSpoonpQuantity) => this.setState({bigSpoonpQuantity})} 
                  onBlur={this.onBlurNumeralState.bind(this, 'bigSpoonpQuantity')} />
              </Item>
              <Item floatingLabel>
                <Label>Nº de colheres pequenas</Label>
                <Input 
                  keyboardType='numeric'
                  value={this.state.smallSpoonpQuantity.toString()}
                  onChangeText={(smallSpoonpQuantity) => this.setState({smallSpoonpQuantity})} 
                  onBlur={this.onBlurNumeralState.bind(this, 'smallSpoonpQuantity')} />
              </Item>
              <Grid style={Layout.padding}>
                <Row style={{ alignItems: 'flex-end' }}>
                  <Col>
                    <Text>Quantidade total</Text>
                  </Col>
                  <Col>
                    <Text note>{this.calcAdulticidaQuantity()}g</Text>
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Content>
        </Modal>
      </Container>
    );
  }

  openModal(){
    // reset modal inputs and open modal
    this.setState({ smallSpoonpQuantity: 0.0, bigSpoonpQuantity: 0.0, modalIsVisible: true });
  }

  updateQuantity(){
    let number = numeral(this.state.quantity);
        
    if(number.value() > 0){
      this.setState({ quantity: number.value() });
    } else{      
      this.setState({ quantity: ( number.value() * -1 ) });
    }
  }

  toNumeral(str){
    let number = numeral(str).value();
    return Math.abs(number);
  }


  onBlurNumeralState(key){
    let updates = {};

    updates[key] = this.toNumeral(this.state[key]);

    this.setState(updates);
  }

  onSubmit(){
    this.props.onSubmit(this.state);
    // Next Step
    this.props.scrollBy(1);
  }
  
  onConfirm () {
    this.setState({ modalIsVisible: false, adulticida_quantity: this.calcAdulticidaQuantity() });
  }

  onCancel () {
    this.setState({ modalIsVisible: false });
  }

  calcAdulticidaQuantity(){
    return ( this.toNumeral(this.state.smallSpoonpQuantity) * 0.1 ) + this.toNumeral(this.state.bigSpoonpQuantity);
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
    borderLeftColor: '#eee'
  }
};
