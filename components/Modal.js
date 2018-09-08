import React from 'react';

import {
  Container,
  Text,
  Button,
  H3,
} from 'native-base';

import { Col, Grid } from 'react-native-easy-grid';

import { View } from 'react-native';

import Modal from 'react-native-modal';

export default class _Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={styles.container}>
          <Container style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <H3 style={styles.modalHeaderTitle}>{this.props.title}</H3>
            </View>
            <View style={{ flex: 1, justifyContent: 'center'}}>
              { this.props.children }
            </View>
            <Grid style={styles.modalFooter}>              
              <Col>
                <Button transparent full primary onPress={this.props.onCancel}>
                  <Text>Cancelar</Text>
                </Button>
              </Col>
              <Col>
                <Button transparent full primary onPress={this.props.onConfirm}>
                  <Text>Ok</Text>
                </Button>
              </Col>
            </Grid>
          </Container>
        </View>
      </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: 360
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 4
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalHeader: {
    maxHeight: 64,
    justifyContent: 'center',
    borderBottomColor: '#cccccc',
  },
  modalHeaderTitle: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    fontWeight: 'bold'
  },
  modalFooter: {
    maxHeight: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopColor: '#cccccc',
  }
}
