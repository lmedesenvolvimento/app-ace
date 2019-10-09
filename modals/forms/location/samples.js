import React from 'react';
import { View, Alert, FlatList } from 'react-native';

import _ from 'lodash';

import numeral from 'numeral';

import { generate } from 'shortid'

import {
  Container,
  Content,
  H2,
  H3,
  Text,
  Footer,
  Form,
  Label,
  List,
  ListItem,  
  Item,
  Input,
  Body,
  Button,
  Picker,
  Icon
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

import { StepBars, Step } from './StepBars';
import { SampleType, SampleDeposits } from '../../../types/sample';

import TimerMixin from 'react-timer-mixin';

const initialItem = {
  number: 0,
  type: SampleType.a1,
  processing: false,
  deposit: 0,
};

export class SamplesForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      newItem: _.clone(initialItem),
      data: []
    };
  }

  componentWillMount(){    
    let { payload } = this.props;
    if (payload && payload.visit && payload.visit.samples){
      const data = payload.visit.samples.map((s) => {
        s.$id = generate()
        return s
      })      
      this.setState({ data });
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
              <Step active={true}></Step>
              <Step></Step>
              <Step></Step>
            </StepBars>
            <Grid>
              <Row style={Layout.marginVertical8}>
                <Col style={Layout.padding}>
                  <H2>Coleta de Amostra</H2>                
                  <Text style={Layout.marginVertical8} note>Preencha abaixo os dados referentes a coleta que você deseja adicionar:</Text>
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingHorizontal: 4 }}>
                  <Item floatingLabel>
                    <Label> Nº da Coleta</Label>
                    <Input
                      keyboardType='numeric'
                      onChangeText={(number) => this.setState({ newItem: { ...this.state.newItem, number: number } })}
                      onBlur={this.onBlurNumeralState.bind(this, 'number')}
                    >
                      {this.state.newItem.number.toString()}
                    </Input>
                  </Item>
                </Col>
                <Col style={{ paddingHorizontal: 4 }}>
                  <Label style={{ color: '#999', fontSize: 16 }}>Tipo de Código</Label>
                  <Picker
                    selectedValue={this.state.newItem.type}
                    onValueChange={(type) => this.setState({ newItem: { ...this.state.newItem, type: type, deposit: 0 } })}
                    supportedOrientations={['portrait', 'landscape']}
                    iosHeader='Selecione um'
                    mode='dropdown'>
                    <Picker.Item label='A1' value={SampleType.a1} />
                    <Picker.Item label='A2' value={SampleType.a2} />
                    <Picker.Item label='B' value={SampleType.b} />
                    <Picker.Item label='C' value={SampleType.c} />
                    <Picker.Item label='D1' value={SampleType.d1} />
                    <Picker.Item label='D2' value={SampleType.d2} />
                    <Picker.Item label='E' value={SampleType.e} />
                  </Picker>
                </Col>
              </Row>
              <Row>
                <Col style={{ paddingHorizontal: 4, paddingVertical: 8 }}>
                  <Label style={{ color: '#999', fontSize: 16 }}>Tipo de Depósito</Label>
                  <Picker
                    selectedValue={this.state.newItem.deposit}
                    onValueChange={(deposit) => this.setState({ newItem: { ...this.state.newItem, deposit } })}
                    supportedOrientations={['portrait', 'landscape']}
                    iosHeader='Selecione um'
                    mode='dropdown'>
                    <Picker.Item label='Selecione um tipo de depósito' value={undefined} />
                    { this.renderDepositTypes() }
                  </Picker>
                </Col>
              </Row>
              <Row style={Layout.marginVertical8}>
                <Col></Col>
                <Button primary onPress={() => this.addSampleItem()} style={{ alignSelf: 'center' }}>
                  <Text>Adicionar Coleta +</Text>
                </Button>
                <Col></Col>
              </Row>
              <Row>
                <Col style={Layout.padding}>
                  <H3 style={{ color: Colors.primaryColor }}>Suas Amostras</H3>
                </Col>                  
              </Row>
              <Row>
                <Col>
                  {
                    this.state.data.length
                      ? <FlatList
                          keyExtractor={({ $id }) => $id}
                          data={this.state.data}
                          renderItem={this.renderItem.bind(this)}
                          extraData={this.state}
                        />
                      : <Text note style={Layout.marginHorizontal}>Esta visita não possui nenhuma amostra.</Text>
                  }                    
                </Col>
              </Row>                                                
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor: '#FFFFFF'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button 
                  full 
                  transparent 
                  disabled={this.state.busy} 
                  onPress={this.onCancel.bind(this)}
                  style={{ backgroundColor: 'transparent', elevation: 0 }}
                  >
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
                <Button 
                  full 
                  transparent 
                  disabled={this.state.busy} 
                  onPress={this.onSubmit.bind(this)}
                  style={{ backgroundColor: 'transparent', elevation: 0 }}
                >
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
    if(this.state.newItem.number && !this.state.data.length){
      Alert.alert(
        'Falha na coleta de amostras',
        'O campo Nº da Coleta possui um valor, porém sua coleta está vazia.',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },          
        ],
        { cancelable: true }
      );

      return false;  
    }

    if(this.state.processing) return;
    
    this.setState({ processing: true });

    TimerMixin.requestAnimationFrame(this._onSubmit.bind(this));
  }
  
  _onSubmit(){    
    this.props.onSubmit(this.state.data, () => {
      this.setState({ processing: false });
      this.props.scrollBy(1);
    });
  }
  
  onCancel(){
    if(this.state.processing) return;
    this.props.scrollBy(-1);
  }

  onBlurNumeralState(){
    let number = numeral(this.state.newItem.number).value();
    let updates = { 
      newItem: { ...this.state.newItem } 
    };

    updates.newItem.number = Math.abs(number);

    this.setState(updates);
  }

  renderItem = ({item, index}) => {
    return(
      <ListItem onPress={() =>  this.removeSampleItem(index)}>
        <Body>
          <Text>{ `Nº da Coleta ${item.number}` }</Text>
          <Text note> {`Tipo da coleta: ${Object.keys(SampleType)[item.type].toUpperCase()} - ${this.renderDepositType(item)}`}</Text>
        </Body>
      </ListItem>
    );
  }  

  renderDepositTypes = () => {
    const { newItem } = this.state;
    let deposits = [];

    switch (newItem.type) {
      case SampleType.a1:
        deposits = SampleDeposits.a1;
        break;
      case SampleType.a2:
        deposits = SampleDeposits.a2;
        break;
      case SampleType.b:
        deposits = SampleDeposits.b;
        break;
      case SampleType.c:
        deposits = SampleDeposits.c;
        break;
      case SampleType.d1:
        deposits = SampleDeposits.d1;
        break;
      case SampleType.d2:
        deposits = SampleDeposits.d2;
        break;
      case SampleType.e:
        deposits = SampleDeposits.e;
        break;
      default:
        break;
    }

    deposits = _.orderBy(deposits, ['label'])

    return deposits.map(({ key, label, value }) => (
      <Picker.Item key={key} label={label} value={value} />
    ));              
  }

  renderDepositType({ type, deposit }){
    const values = Object.values(SampleDeposits);
    const result = _.find(values[type], { value: deposit });
    return result ? result.label : '';
  }

  addSampleItem(){
    const { newItem } = this.state;

    newItem.$id = generate()
    
    if (_.isUndefined(newItem.number) || newItem.number <= 0){
      Alert.alert(
        'Falha na numeração da coleta',
        'A numeração da amostra não pode ser igual a zero',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },          
        ],
        { cancelable: true }
      );
      return false;
    } 

    if (_.isUndefined(newItem.deposit) || newItem.deposit <= 0){
      Alert.alert(
        'Falha no tipo de depósito',
        'Tipo de depósito não pode estar vazio',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },          
        ],
        { cancelable: true }
      );
      return false;
    } 

    this.state.data.unshift( _.clone(this.state.newItem));
    this.setState({ data: this.state.data, newItem: initialItem });
  }

  removeSampleItem(rowId){
    let { data } = this.state;
    Alert.alert(
      'Excluir Amostra',
      'Você deseja realmente excluir esta amostra?',
      [
        { text: 'Não', onPress: () => false, style: 'cancel' },
        {
          text: 'Sim', onPress: () => {            
            data.splice(rowId, 1);
            this.setState({ data });
          }
        },
      ],
      { cancelable: true }
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
  },
  lastField: {
    paddingBottom: 48
  }
};
