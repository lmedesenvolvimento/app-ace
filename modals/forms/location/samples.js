import React from 'react';
import { View, Alert, ListView } from 'react-native';

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
  List,
  ListItem,  
  Item,
  Input,
  Body,
  Button,
  Picker,
  Icon
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

import { SampleType } from '../../../types/sample';

const initialItem = {
  value: 0,
  type: SampleType.a1
}

export class SamplesForm extends React.Component {
  state = {
    newItem: _.clone(initialItem),
    data: [
      {
        value: 2,
        type: SampleType.a1
      },
      {
        value: 4,
        type: SampleType.a2
      },
      {
        value: 5,
        type: SampleType.b
      }
    ]
  }

  constructor(props){
    super(props);
  }

  componentWillMount(){    
    // let { address } = this.props;
    // if(address){
    //   this.setState({ data: address.samples })
    // }
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
                <H2 style={Layout.padding}>Inspeção de coleta de larvas 2</H2>                
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
                        <Label>Quantidade de Itens</Label>
                        <Input
                          value={this.state.newItem.value.toString()}
                          keyboardType='numeric'
                          onChangeText={ (value) => this.setState({ newItem: { ...this.state.newItem, value: value } }) }
                          onBlur={this.onBlurNumeralState.bind(this, 'value')} />
                      </Item>
                    </Col>
                    <Col>
                      <Picker
                        selectedValue={this.state.newItem.type}
                        onValueChange={(type) => this.setState({ newItem: { ...this.state.newItem, type: type} })}
                        supportedOrientations={['portrait', 'landscape']}
                        iosHeader="Selecione um"
                        mode="dropdown">
                          <Item label="A1" value={SampleType.a1} />
                          <Item label="A2" value={SampleType.a2} />
                          <Item label="B" value={SampleType.b} />
                          <Item label="C" value={SampleType.c} />
                          <Item label="D1" value={SampleType.d1} />
                          <Item label="D2" value={SampleType.d2} />
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
    this.props.scrollBy(1)
  }

  onBlurNumeralState(key){
    let number = numeral(this.state.newItem.value).value()
    let updates = { 
      newItem: { ...this.state.newItem } 
    }

    updates.newItem.value = Math.abs(number)

    this.setState(updates)
  }

  renderItem(item, key){
    return(
      <ListItem>
        <Body>
          <Text>{ `${item.value} ${ item.value > 1 ? "itens" : "itens" } coletado` }</Text>
          <Text note> Tipo da coleta: { Object.keys(SampleType)[item.type].toUpperCase() }</Text>
        </Body>
      </ListItem>
    );
  }

  renderRightHiddenRow(data, secId, rowId, rowMap) {
    return (
      <Button danger onPress={this.removeSampleItem.bind(this, secId, rowId, rowMap )}>
        <Icon active name="trash" />
      </Button>
    );
  }

  renderLeftHiddenRow(data, secId, rowId, rowMap) {
    return (
      <View></View>
    );
  }

  addSampleItem(){
    if (this.state.newItem.value <= 0){
      Alert.alert(
        'Falha na coleta',
        'A quantidade de itens não pode ser menor ou igual a zero',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },          
        ],
        { cancelable: true }
      );
      return true;
    } else{
      this.state.data.push( _.clone(this.state.newItem))
      this.setState({ data: this.state.data, newItem: initialItem })
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
    borderLeftColor: "#eee"
  },
  lastField: {
    paddingBottom: 48
  }
}