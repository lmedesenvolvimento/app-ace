import React from 'react';
import { View, Alert, ListView } from 'react-native';

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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

import { StepBars, Step } from './StepBars';
import { SampleType } from '../../../types/sample';

import TimerMixin from 'react-timer-mixin';

const initialItem = {
  number: 0,
  type: SampleType.a1,
  processing: false
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
      this.setState({ data: payload.visit.samples });
    }
  }

  render(){
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (
      <Container>
        <KeyboardAwareScrollView>
          <Content padder>
            <Form>
              <StepBars>
                <Step complete={true}></Step>
                <Step complete={true}></Step>
                <Step active={true}></Step>
                <Step></Step>
                <Step></Step>
              </StepBars>
              <H2 style={Layout.padding}>Coleta de Amostra</H2>                
              <Grid>
                <Row>
                  <Col>
                    <List
                      dataSource={ds.cloneWithRows(this.state.data)}
                      renderRow={this.renderItem.bind(this)}
                      renderLeftHiddenRow={this.renderLeftHiddenRow.bind(this)}
                      renderRightHiddenRow={this.renderRightHiddenRow.bind(this)}
                      enableEmptySections={true}
                      onRowOpen={false}
                      leftOpenValue={0}
                      rightOpenValue={-75} />
                  </Col>
                </Row>
                <Row>
                  <Col style={Layout.padding}>
                    <Text style={{ color: Colors.primaryColor }}>Preencha abaixo a coleta que deseja adicionar</Text>
                  </Col>
                </Row>
                <Row style={{ alignItems: 'flex-end' }}>
                  <Col>
                    <Item floatingLabel>
                      <Label> Nº da Coleta</Label>
                      <Input
                        value={this.state.newItem.number.toString()}
                        keyboardType='numeric'
                        onChangeText={ (number) => this.setState({ newItem: { ...this.state.newItem, number: number } }) }
                        onBlur={this.onBlurNumeralState.bind(this, 'number')} />
                    </Item>
                  </Col>
                  <Col>
                    <Label style={{ color: '#999', fontSize: 16 }}>Tipo de Código</Label>
                    <Picker
                      selectedValue={this.state.newItem.type}
                      onValueChange={(type) => this.setState({ newItem: { ...this.state.newItem, type: type} })}
                      supportedOrientations={['portrait', 'landscape']}
                      iosHeader='Selecione um'
                      mode='dropdown'>
                      <Item label='A1' value={SampleType.a1} />
                      <Item label='A2' value={SampleType.a2} />
                      <Item label='B' value={SampleType.b} />
                      <Item label='C' value={SampleType.c} />
                      <Item label='D1' value={SampleType.d1} />
                      <Item label='D2' value={SampleType.d2} />
                      <Item label='E' value={SampleType.e} />
                    </Picker>
                  </Col>
                </Row>
                <Row style={Layout.marginVertical8}>
                  <Col>
                    <Button transparent primary block onPress={this.addSampleItem.bind(this)}>
                      <Text>+ Adicionar Coleta</Text>
                    </Button>
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Content>
        </KeyboardAwareScrollView>
        <Footer style={{backgroundColor:'white'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full disabled={this.state.busy} transparent onPress={this.onCancel.bind(this)}>
                  <Text>Voltar</Text>
                </Button>
              </Col>
              <Col style={styles.colLeftBorder}>
                <Button full disabled={this.state.busy} transparent onPress={this.onSubmit.bind(this)}>
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

  renderItem(item){
    return(
      <ListItem>
        <Body>
          <Text>{ `Nº da Coleta ${item.number}` }</Text>
          <Text note> Tipo da coleta: { Object.keys(SampleType)[item.type].toUpperCase() }</Text>
        </Body>
      </ListItem>
    );
  }

  renderRightHiddenRow(data, secId, rowId, rowMap) {
    return (
      <Button danger onPress={this.removeSampleItem.bind(this, secId, rowId, rowMap )}>
        <Icon active name='trash' />
      </Button>
    );
  }

  renderLeftHiddenRow() {
    return (
      <View></View>
    );
  }

  addSampleItem(){
    if (_.isUndefined(this.state.newItem.number) || this.state.newItem.number <= 0){
      Alert.alert(
        'Falha na numeração da coleta',
        'A numeração da amostra não pode ser igual a zero',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },          
        ],
        { cancelable: true }
      );
      return true;
    } else{
      this.state.data.push( _.clone(this.state.newItem));
      this.setState({ data: this.state.data, newItem: initialItem });
    }
  }

  removeSampleItem(secId, rowId, rowMap){
    // Force close row
    rowMap[`${secId}${rowId}`].props.closeRow();    
    this.state.data.splice(rowId, 1)    ;
    this.setState({ data: this.state.data });
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
