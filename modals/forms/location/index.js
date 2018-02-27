import React from 'react';
import { View, Alert } from 'react-native';

import * as _ from 'lodash';

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
import momentTimezone from "moment-timezone";

import Theme from '../../../constants/Theme';
import Layout from '../../../constants/Layout';

import { simpleToast } from '../../../services/Toast';

import { StepBars, Step } from './StepBars';

import { VisitType, VisitTypeLocation } from '../../../types/visit';

export class LocationForm extends React.Component {
  state = {
    number: null,
    complement: null,
    check_in: moment(),
    type: VisitType.normal,
    type_location: 'residential',
    validation: {
      number: false,
      check_in_translate: false
    }
  }  

  constructor(props){
    super(props);
    this.state.check_in_translate = this.state.check_in.format('HH:mm')
  }

  componentWillMount(){
    let updates = {
      address: this.props.publicarea.address
    }

    if(this.props.address){
      let { address } = this.props

      updates.number = address.number
      updates.complement = address.complement
      updates.type = address.visit.type
      updates.type_location = address.visit.type_location
      updates.check_in = address.visit.type == VisitType.closed ? moment() : moment(address.visit.check_in)
      updates.check_in_translate = updates.check_in.format('HH:mm')
    }

    this.setState(updates)
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
            </StepBars>

            <H2 style={Layout.padding}>Localização</H2>

            <Grid>
              <Col size={66}>
                <Item floatingLabel>
                  <Label>Logradouro</Label>
                  <Input value={this.state.address}  disabled={true}/>
                </Item>
              </Col>
              <Col size={33}>
                <Item floatingLabel error={this.state.validation.number}>
                  <Label>Número</Label>
                  <Input value={this.state.number} onChangeText={(number) => this.setState({number})} keyboardType='numeric' />
                </Item>
              </Col>
            </Grid>

            <Grid>
              <Col size={66} style={{ justifyContent: 'flex-end' }}>
                <Item floatingLabel>
                  <Label>Complemento</Label>
                  <Input value={this.state.complement} onChangeText={(complement) => this.setState({complement})} />
                </Item>
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
            </Grid>

            <Grid style={{ marginHorizontal: 12, marginTop: 24 }}>
              <Col>
                <Text note>Tipo de Imóvel</Text>
                <Picker
                  selectedValue={this.state.type_location}
                  onValueChange={(type_location) => this.setState({type_location}) }
                  supportedOrientations={['portrait','landscape']}
                  iosHeader="Selecione um"
                  mode="dropdown">
                  <Item label="Residencial" value={VisitTypeLocation.residential} />
                  <Item label="Comércio" value={VisitTypeLocation.commerce} />
                  <Item label="Terreno baldio" value={VisitTypeLocation.wasteland} />
                  <Item label="Ponto Estratégico" value={VisitTypeLocation.strategic_point} />
                  <Item label="Outros" value={VisitTypeLocation.others} />
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
                  iosHeader="Selecione um"
                  mode="dropdown">
                  <Item label="Normal" value={VisitType.normal} />
                  <Item label="Recuperada" value={VisitType.recovered} />
                  <Item label="Fechada" value={VisitType.closed} />
                  <Item label="Recusada" value={VisitType.refused} />
                </Picker>
              </Col>
            </Grid>
          </Form>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
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
      Alert.alert('Falha na Validação', 'Por favor cheque se todos os campos estão preenchidos.')
    } else {
      // Covert check_in string to Timestamp
      time = this.state.check_in_translate.split(':')
      
      this.state.check_in.set({
        h: time[0],
        m: time[1]
      })

      this.state.check_in = momentTimezone.tz(this.state.check_in, "America/Sao_paulo").format()

      // Pass form value parent component
      let state = _.omit(this.state,['validation','check_in_translate'])
      this.props.onSubmit(state)
      // Next step
      this.props.scrollBy(1)
    }
  }

  applyStartDateMask(check_in_translate){
    check_in_translate = check_in_translate.replace(':','')
    let result = new StringMask("00:00").apply(check_in_translate)
    // Is nesscessary for clean field
    this.setState({ check_in_translate: result });
  }

  isInvalid(){
    const { number, check_in_translate } = this.state;

    this.state.validation = {
      number: _.isEmpty(number),
      check_in_translate: _.isEmpty(check_in_translate),
    }

    // Update view
    this.setState({
      validation: this.state.validation
    });

    // Verify if all states has present
    return _.values(this.state.validation).includes(true)
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
}
