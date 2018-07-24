import React from 'react';
import { Alert } from 'react-native';

import _ from 'lodash';

import numeral from 'numeral';

import {
  Header,
  Container,
  Content,
  H2,
  H3,
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
  DatePicker
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import StringMask from 'string-mask';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

import Layout from '../../../constants/Layout';
import Colors from '../../../constants/Colors';

import { StepBars, Step } from './StepBars';

import { VisitType, VisitTypeLocation } from '../../../types/visit';

import TimerMixin from 'react-timer-mixin';

export class LocationForm extends React.Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      number: '',
      complement: null,
      check_in: moment(),
      type: VisitType.normal,
      type_location: VisitTypeLocation.residential,
      validation: {
        number: false,
        check_in_translate: false
      }
    };

    this.state.check_in_translate = this.state.check_in.format('HH:mm');
  }

  componentWillMount(){
    let updates = {
      address: this.props.publicarea.address
    };

    if(this.props.address){
      let { address } = this.props;
      
      updates.id = address.id;
      updates.number = address.number;
      updates.complement = address.complement;

      if(this.props.address.visit){
        updates.type = address.visit.type;
        updates.type_location = address.visit.type_location;
        updates.check_in = isVisitClosedOrRefused(address.visit.type) ? moment() : moment(address.visit.check_in);
        updates.check_in_translate = updates.check_in.format('HH:mm');
      }
    }

    this.setState(updates);
  }

  render(){
    return (
      <Container>
        <Content padder>
          <Form>
            <StepBars>
              <Step active={true}></Step>
              <Step></Step>
              <Step></Step>
              <Step></Step>
              <Step></Step>
            </StepBars>

            <H2 style={Layout.padding}>Localização</H2>

            <Grid>
              <Row>
                <Col>
                  <H3 note style={Layout.padding}>{this.state.address}</H3>
                </Col>
              </Row>
              <Row>
                <Col size={33}>
                  <Item floatingLabel error={this.state.validation.number}>
                    <Label>Número</Label>
                    <Input 
                      disabled={this.state.id}
                      keyboardType='numeric'
                      value={this.state.number ? this.state.number.toString() : ''} 
                      onChangeText={(number) => this.setState({number})} 
                      onBlur={this.onBlurNumeralState.bind(this)} />
                  </Item>
                </Col>
                <Col size={66} style={{ justifyContent: 'flex-end' }}>
                  <Item floatingLabel>
                    <Label>Complemento</Label>
                    <Input disabled={this.state.id} value={this.state.complement} onChangeText={(complement) => this.setState({complement})} />
                  </Item>
                </Col>
              </Row>
            </Grid>

            <Grid style={Layout.padding}>
              <Row style={{ alignItems: 'flex-end' }}>
                <Col size={66}>
                  <Text note>Data</Text>
                  <DatePicker
                    defaultDate={ this.state.check_in._d ? this.state.check_in.toDate() : new Date() }
                    minimumDate={new Date(2018, 1, 1)}
                    locale={'pt-br'}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={'fade'}
                    androidMode={'default'}
                    placeHolderText={ this.state.check_in._d ? this.state.check_in.format('DD/MM/YYYY') : 'Selecione uma data' }
                    textStyle={{ color: Colors.iconColor, paddingHorizontal: 0, paddingBottom: 0 }}
                    placeHolderTextStyle={{ color: Colors.iconColor, paddingHorizontal: 0, paddingBottom: 0 }}
                    onDateChange={ (check_in) => this.setState({ check_in: moment(check_in) }) }
                  />
                </Col>
                <Col size={33}>
                  <Item floatingLabel error={this.state.validation.check_in_translate}>
                    <Label>Entrada</Label>
                    <Input
                      value={this.state.check_in_translate}
                      keyboardType='numeric'
                      onChangeText={ this.applyStartDateMask.bind(this) } />
                  </Item>
                </Col>
              </Row>
            </Grid>

            <Grid style={{ marginHorizontal: 12, marginTop: 24 }}>
              <Col>
                <Text note>Tipo de Imóvel</Text>
                <Picker
                  selectedValue={this.state.type_location}
                  onValueChange={(type_location) => this.setState({type_location}) }
                  supportedOrientations={['portrait','landscape']}
                  renderHeader={this._renderPickerHeader.bind(this)}
                  mode='dropdown'>
                  <Item label='Residencial' value={VisitTypeLocation.residential} />
                  <Item label='Comércio' value={VisitTypeLocation.commerce} />
                  <Item label='Terreno baldio' value={VisitTypeLocation.wasteland} />
                  <Item label='Ponto Estratégico' value={VisitTypeLocation.strategic_point} />
                  <Item label='Outros' value={VisitTypeLocation.others} />
                </Picker>
              </Col>
            </Grid>

            <Grid style={Layout.padding}>
              <Col>
                <Text note>Pendência</Text>
                <Picker
                  selectedValue={this.state.type}
                  onValueChange={(type) => this.setState({type}) }
                  supportedOrientations={['portrait','landscape']}
                  renderHeader={this._renderPickerHeader.bind(this)}
                  mode='dropdown'>
                  <Item label='Normal' value={VisitType.normal} />
                  <Item label='Recuperada' value={VisitType.recovered} />
                  <Item label='Fechada' value={VisitType.closed} />
                  <Item label='Recusada' value={VisitType.refused} />
                </Picker>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:'white'}} padder>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <Button full transparent onPress={ () => this.props.onCancel() }>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col style={[styles.col, styles.colLeftBorder]}>
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
      if(this.isHasNumberInPublicArea()){
        Alert.alert('Falha no registro da residência', 'A residência já foi cadastrada.');
      } else {
        Alert.alert('Falha na Validação', 'Por favor cheque se todos os campos estão preenchidos.');
      }
    } else {
      // Force instance momment
      this.state.check_in = moment(this.state.check_in);
      
      // Covert check_in string to Timestamp
      let time = this.state.check_in_translate.split(':');
    
      // set for translate check_i date
      this.state.check_in.set({
        h: time[0],
        m: time[1]
      });

      let updates = _.clone(this.state);

      updates.check_in = momentTimezone.tz(updates.check_in, 'America/Sao_paulo').format();

      // Pass form value parent component
      let state = _.omit(updates,['validation','check_in_translate']);
      
      // Next step
      isVisitClosedOrRefused(this.state.type)
        ? this.toObservation()
        : this.props.scrollBy(1);

      
      // Otimize swipper transition
      TimerMixin.requestAnimationFrame(() => {
        this.props.onSubmit(state);
      });
    }
  }

  onBlurNumeralState(){
    let number = numeral(this.state.number).value();
    let updates = {};

    updates.number =  Math.floor( Math.abs(number) ) || '';

    this.setState(updates);
  }

  applyStartDateMask(check_in_translate){
    check_in_translate = check_in_translate.replace(':','');
    let result = new StringMask('00:00').apply(check_in_translate);
    // Is nesscessary for clean field
    this.setState({ check_in_translate: result });
  }

  isInvalid(){
    const { number, check_in_translate } = this.state;

    this.state.validation = {
      number: _.isEmpty(number.toString()) || this.isHasNumberInPublicArea(),
      check_in_translate: _.isEmpty(check_in_translate),
    };

    // Update view
    this.setState({
      validation: this.state.validation
    });

    // Verify if all states has present
    return _.values(this.state.validation).includes(true);
  }

  isHasNumberInPublicArea(){
    // if registred address has same state number
    if(this.props.address && this.props.address.number.toString() == this.state.number.toString()){
      return false;
    }

    return _.chain(this.props.publicarea.addresses).find(
      (a) => {
        return ( a.number.toString() == this.state.number.toString() ) && ( a.complement == this.state.complement );
      } 
    ).value()
      ? true 
      : false;
  }

  toObservation(){
    return this.props.scrollBy(4);
  }

  _renderProgress(){
    return (
      <Grid>
        <Row>
          <Col style={styles.progressItemActive}></Col>
          <Col style={styles.progressItem}></Col>
          <Col style={styles.progressItem}></Col>
          <Col style={styles.progressItem}></Col>
        </Row>
      </Grid>
    );
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
  },
  progressItem:{
    width: 32,
    height: 16,
    backgroundColor: 'grey'
  },
  progressItemActive: {
    ...this.progressItem,
    backgroundColor: 'orange'
  },
  progressItemComplete: {
    ...this.progressItem,
    backgroundColor: 'red'
  }
};

// Checks
function isVisitClosedOrRefused(type){
  return [VisitType.closed, VisitType.refused].includes(type);
}