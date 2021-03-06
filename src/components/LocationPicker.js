import * as React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';

import Input from './Input';
import { IMAGES } from '../utils/design/images';
import { withContext } from '../Context';
import { getLocation } from '../utils/api';

const ModalContent = styled(LinearGradient).attrs({
  colors: ['#53B1FF', '#651FFF'],
  start: { x: 0, y: 1 },
  end: { x: 1, y: 1 },
})`
border-radius: 10px;
  padding: 24px;  
`;

const ModalTitle = styled.Text`
  color: ${props => props.theme.colors.secondaryColor};
  font-weight: bold;
  font-size: 28;
  padding-top: 24;
`;

const CloseAction = styled.TouchableOpacity`  
  justify-content: center;
  align-items: center;
  margin-bottom: 12;
  margin-top: 6;
  width: 20;
  height: 20;
`;

const CloseIcon = styled.Image.attrs({
  source: IMAGES.CLOSE,
})`
  tint-color: white;
  height: 20;
  width: 20;
`;

const IsLoadingContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 150px;
`;

const Loading = styled.ActivityIndicator.attrs({
  color: 'white',
  animating: true,
})``;

const ActionButtonContainer = styled.View`
  align-items: flex-end;
  padding-top: 24px;
  width: 100%;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: white;
  padding: 8px 20px;
  margin: 10px 0px;
  border-radius: 20;
  z-index: 1000;
`;

const ActionButtonText = styled.Text`
  color: ${props => props.theme.colors.primaryColor};
  font-weight: 800;
  font-size: 16;
`;

type Props = {
  onClosePicker: () => void,
  onFindLocation: () => void,
  isVisible: boolean,
};

@withContext class LocationPicker extends React.Component<Props, State> {
  state = {
    isLoading: false,
    zipCode: '',
    number: '',
  };

  async onSearchLocation() {
    this.setState({
      isLoading: true,
    });

    const { zipCode, number } = this.state;
    const res = await getLocation(zipCode, number);

    this.onSearchEnd(res);
  }

  onSearchEnd = res => {
    const { onFindLocation } = this.props;

    onFindLocation({
      ...res,
      zipCode: this.state.zipCode,
      number: this.state.number,
    });

    this.setState({
      isLoading: false,
    });
  };

  renderLoading = () => (
    <IsLoadingContainer>
      <Loading />
    </IsLoadingContainer>
  );

  renderForm = onClosePicker => (
    <React.Fragment>
      <CloseAction onPress={() => onClosePicker()}>
        <CloseIcon />
      </CloseAction>
      <ModalTitle>Set the location of the event</ModalTitle>
      <Input
        mask="[00000]-[000]"
        value={this.state.zipCode}
        placeholder="Zip Code"
        onChangeText={(zipCode: string) => this.setState({ zipCode })}
      />
      <Input
        value={this.state.number}
        placeholder="Number"
        onChangeText={(number: string) => this.setState({ number })}
      />
      <ActionButtonContainer>
        <ActionButton onPress={() => this.onSearchLocation()}>
          <ActionButtonText>Pick Location</ActionButtonText>
        </ActionButton>
      </ActionButtonContainer>
    </React.Fragment>
  );

  render() {
    const { isVisible, onClosePicker } = this.props;

    return (
      <Modal isVisible={isVisible}>
        <ModalContent>
          {this.state.isLoading ? this.renderLoading() : this.renderForm(onClosePicker)}
        </ModalContent>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </Modal>
    );
  }
}

export default LocationPicker;
