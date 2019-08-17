import React from 'react';

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
  List,
  ListItem,
  Item,
  Input,
  Icon,
  Body,
  Button,
  Picker,
} from 'native-base';

import { Col, Row, Grid } from 'react-native-easy-grid';

import { Alert, ListView, View } from 'react-native';

import Modal from '../../../components/Modal';

import numeral from 'numeral';

import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

import { StepBars, Step } from './StepBars';

import { TreatmentType, TreatmentTypeI18n } from '../../../types/treatment';

import TimerMixin from 'react-timer-mixin';

import { omit, find, clone } from 'lodash';

const initialForm = {
  type: TreatmentType.larvicida_pyriproxyfen,
  quantity: 0.0,
  adulticida_quantity: 0.0
};

export class TreatmentForm extends React.Component {
  
  constructor(props){
    super(props);
    this.props.state = {};
    
    this.state = {
      modalIsVisible: false,
      interModalIsVisible: false,
      bigSpoonpQuantity: 0.0,
      smallSpoonpQuantity: 0.0,
      processing: false,
      treatments: [],
      form: initialForm
    };
  }

  componentWillMount(){
    let { payload } = this.props;
    if(payload && payload.visit){
      if(payload.visit.treatment){
        let { treatment } = payload.visit;        
        treatment.type = TreatmentType.larvicida_pyriproxyfen;
        this.setState({ treatments: this.state.treatments });
      } 
      else if (payload.visit.treatments && payload.visit.treatments.length){
        this.setState({ treatments: payload.visit.treatments });
      }
    }
  }

  render(){
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

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

            <Grid>
              <Col style={Layout.padding}>
                <H2>Tratamento focal/perifocal</H2>
                <Text style={[Layout.marginVertical8, { color: Colors.primaryColor }]}>Larvicída</Text>
              </Col>
            </Grid>

            <Grid>
              <Col>
                <Item floatingLabel >
                  <Label>N de depósitos tratados</Label>
                  <Input 
                    keyboardType='numeric'
                    value={this.state.form.quantity.toString()}
                    onChangeText={(quantity) => this.setState(prevState => ({
                      form: {
                        ...prevState.form,
                        quantity
                      }
                    }))} 
                    onBlur={this.onFormBlurNumeralState.bind(this, 'quantity')} />
                </Item>
              </Col>
            </Grid>
            <Grid style={{ marginTop: 24, marginBottom: 16 }}>
              <Col>
                <Text note>Tipo de Código</Text>
                <Picker
                  selectedValue={this.state.form.type}
                  onValueChange={(type) => this.setState(prevState => ({
                    form: {
                      ...prevState.form,
                      type
                    }
                  }))}
                  supportedOrientations={['portrait', 'landscape']}
                  iosHeader='Selecione um'
                  mode='dropdown'>
                  <Item label={TreatmentTypeI18n.larvicida_pyriproxyfen} value={TreatmentType.larvicida_pyriproxyfen} />
                  <Item label={TreatmentTypeI18n.larvicida_spinosad} value={TreatmentType.larvicida_spinosad} />
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
                      value={this.state.form.adulticida_quantity.toString()}
                      onChangeText={(adulticida_quantity) => this.setState(prevState => ({
                        form: {
                          ...prevState.form,
                          adulticida_quantity
                        }
                      }))} 
                      onBlur={this.onFormBlurNumeralState.bind(this, 'adulticida_quantity')} />
                  </Item>
                </Col>
                <Col>
                  <Button onPress={this.openModal.bind(this)} transparent>
                    <Text>Calc. Quantidade</Text>
                  </Button>
                </Col>
              </Row>

              <Row style={Layout.marginVertical16}>
                <Col/>
                <Button primary onPress={this.addTreatmentItem.bind(this)}>
                  <Text>Adicionar Tratamento +</Text>
                </Button>    
                <Col/>
              </Row>
            </Grid>

            <Grid>
              <Row>
                <Col style={Layout.padding}>
                  <H3 style={{ color: Colors.primaryColor }}>Seus Tratamentos</H3>
                </Col>
              </Row>
              <Row>
                <Col>
                  {
                    this.state.treatments.length
                      ? <List
                        dataSource={ds.cloneWithRows(this.state.treatments)}
                        renderRow={this.renderItem.bind(this)}
                        renderLeftHiddenRow={this.renderLeftHiddenRow.bind(this)}
                        renderRightHiddenRow={this.renderRightHiddenRow.bind(this)}
                        enableEmptySections={true}
                        onRowOpen={false}
                        leftOpenValue={0}
                        rightOpenValue={-75} />
                      : <Text note style={Layout.marginHorizontal}>Esta visita não possui nenhum tratamento.</Text>
                  }
                </Col>
              </Row>
            </Grid>            

            {/* <Modal isVisible={this.state.modalIsVisible} onConfirm={this.onConfirmModal.bind(this)} onCancel={this.onCancelModal.bind(this)} title='Calcular quantidade'>
              <Content padder>
                <Form>
                  <Item floatingLabel>
                    <Label>Nº de colheres grandes</Label>
                    <Input
                      keyboardType='numeric'
                      value={this.state.bigSpoonpQuantity.toString()}
                      onChangeText={(bigSpoonpQuantity) => this.setState({ bigSpoonpQuantity })}
                      onBlur={this.onBlurNumeralState.bind(this, 'bigSpoonpQuantity')} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Nº de colheres pequenas</Label>
                    <Input
                      keyboardType='numeric'
                      value={this.state.smallSpoonpQuantity.toString()}
                      onChangeText={(smallSpoonpQuantity) => this.setState({ smallSpoonpQuantity })}
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
            </Modal> */}
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
                <Button full transparent disabled={this.state.busy} onPress={this.onSubmit.bind(this)}>
                  <Text>Avançar</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Footer>        
      </Container>
    );
  }

  // Modals  
  openModal(){
    // reset modal inputs and open modal
    this.setState({ smallSpoonpQuantity: 0.0, bigSpoonpQuantity: 0.0, modalIsVisible: true });
  }

  onConfirmModal() {
    this.setState(prevState => ({
      modalIsVisible: false, 
      form:{
        ...prevState.form,
        adulticida_quantity: this.calcAdulticidaQuantity()
      }
    }));
  }

  onCancelModal() {
    this.setState({ modalIsVisible: false });
  }

  calcAdulticidaQuantity() {
    return ((this.toNumeral(this.state.smallSpoonpQuantity) * 0.1) + this.toNumeral(this.state.bigSpoonpQuantity)).toFixed(2);
  }

  // Helpers

  toNumeral(str){
    let number = numeral(str).value();
    return Math.abs(number);
  }

  updateQuantity() {
    let number = numeral(this.state.quantity);

    if (number.value() > 0) {
      this.setState({ quantity: number.value() });
    } else {
      this.setState({ quantity: (number.value() * -1) });
    }
  }


  onFormBlurNumeralState(key){
    let updates = {};

    updates[key] = this.toNumeral(this.state.form[key]);

    this.setState(prevState => ({
      form: {
        ...prevState.form,
        ...updates
      }
    }));

    return updates[key];
  }

  onBlurNumeralState(key){
    let updates = {};

    updates[key] = this.toNumeral(this.state[key]);

    this.setState(updates);
  }
  

  // Form

  onSubmit(){
    if(this.state.form.quantity && !this.state.treatments.length){
      Alert.alert(
        'Falha no tratamento',
        'O campo Nº de depósitos tratads possui um valor, porém tratamento está vazio.',
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
    const omitedAtributes = ['modalIsVisible','bigSpoonpQuantity','smallSpoonpQuantity','processing', 'form'];
    
    this.props.onSubmit( omit(this.state, omitedAtributes), () => {
      this.setState({ processing: false });
      // Next Step
      this.props.scrollBy(1);
    });
  }
  
  
  onCancel(){    
    if(this.state.processing) return;
    this.props.scrollBy(-1);
  }

  addTreatmentItem() {
    let quantity = this.onFormBlurNumeralState('quantity');
    let adulticida_quantity = this.onFormBlurNumeralState('adulticida_quantity');

    this.state.form.quantity = quantity;
    this.state.form.adulticida_quantity = adulticida_quantity;

    if (this.state.form.quantity <= 0.0 || this.state.form.adulticida_quantity <= 0.0 ) {
      Alert.alert(
        'Falha na quantidade do tratamento',
        'O N de depósitos tratados e Larvicida gramas não pode ser igual a zero',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },
        ],
        { cancelable: true }
      );
      return true;
    }
    else if( find(this.state.treatments, { type: this.state.form.type })){
      Alert.alert(
        'Falha tipo de Código',
        'Tipo de Código já existente',
        [
          { text: 'Ok', onPress: () => false, style: 'cancel' },
        ],
        { cancelable: true }
      );
      return true;
    }
    else {
      this.state.treatments.unshift( clone(this.state.form) );
      this.setState({ data: this.state.treatments, form: initialForm });
    }
  }


  removeTreatmentItem(secId, rowId, rowMap){
    // Force close row
    rowMap[`${secId}${rowId}`].props.closeRow();
    this.state.treatments.splice(rowId, 1);
    this.setState({ treatments: this.state.treatments });
  }

  
  // Renders

  _renderPickerHeader(backAction){
    return (
      <Header>
        <Left style={styles.container}>
          <Button transparent onPress={backAction}>
            <Text>Voltar</Text>
          </Button>
        </Left>
        <Body style={{ flex: 2 }}>
          <Title style={{ textAlign: 'center' }}>Selecione um</Title>
        </Body>
      </Header>
    );
  }
  
  renderItem(item){
    return (
      <ListItem>
        <Body>
          <Text>{`N de depósitos tratados ${item.quantity}`}</Text>
          <Text>{`Larvicida gramas ${item.adulticida_quantity}`}</Text>
          <Text note> Tipo de Código: { Object.keys(TreatmentType)[item.type].toUpperCase() }</Text>
        </Body>
      </ListItem>
    );
  }

  renderRightHiddenRow(data, secId, rowId, rowMap) {
    return (
      <Button danger onPress={this.removeTreatmentItem.bind(this, secId, rowId, rowMap)}>
        <Icon active name='trash' />
      </Button>
    );
  }

  renderLeftHiddenRow(){
    return (
      <View></View>
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
