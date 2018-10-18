import React from 'react';
import { Container, Grid, Row, Col, Spinner, Text } from 'native-base';
import { connect } from 'react-redux';

import Modal from './Modal';

import Colors from '../constants/Colors';


class Loading extends React.Component {
  render(){
    return (
      <Modal isVisible={ this.props.ui.loading } small={true} hideHeader={true} hideFooter={true} useNativeDriver={true}>
        <Container>
          <Grid>
            <Row>
              <Col size={25}>
                <Spinner color={Colors.primaryColor} animating={true} style={{marginBottom: 10}}/>
              </Col>
              <Col size={75}>
                <Text style={{ lineHeight: 86 }} note>Aguarde um momento..</Text>
              </Col>
            </Row>
          </Grid>
        </Container>
      </Modal>   
    );
  }  
}

export default connect(({ ui }) => ({ ui }))(Loading);
