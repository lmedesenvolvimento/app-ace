
import React from 'react';

import { WebView } from 'react-native';

import Expo from "expo";

import {
  Text,
  Container,
  Spinner,
  Content,
  Row,
  Col
} from 'native-base';

import { connect } from 'react-redux';

import Colors from '../constants/Colors';

import Modal from '../components/Modal';
import { Grid } from 'react-native-easy-grid';

class ReportCardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: {},
      ready: false
    }
  }
  componentWillMount(){
    let { data } = this.props.currentUser;
    let headers = {
      'X-User-Email': data.email,
      'X-User-Token': data.authentication_token
    }; 

    this.setState({headers, ready: false});
  }

  render() {
    let uri = `${Expo.Constants.manifest.extra.baseurl}/report/agent/work`;
    return (
      <Container>
        <WebView
          source={{ uri, headers: this.state.headers }}
          onLoadEnd={() => this.setState({ready: true})}
        />
        <Modal isVisible={!this.state.ready} small={true} hideHeader={true} hideFooter={true}>
          <Container>
            <Grid>
              <Row>
                <Col size={25}>
                  <Spinner color={Colors.primaryColor} animating={!this.state.ready} style={{marginBottom: 10}}/>
                </Col>
                <Col size={75}>
                  <Text style={{ lineHeight: 86 }} note>Carregando Boletím</Text>
                </Col>
              </Row>
            </Grid>
          </Container>
        </Modal>
      </Container>
      );
    }
}

export default connect(({currentUser}) => ({currentUser}))(ReportCardScreen);