import { Overlay } from 'react-native-elements';
import { Button } from 'react-native';

<Overlay isVisible={this.state.isVisible}>
  <Text>Hello from Overlay!</Text>
</Overlay>;

{
  this.state.visible && (
    <Overlay isVisible>
      <Text>Hello from Overlay!</Text>
    </Overlay>
  );
}

<Overlay
  isVisible={this.state.isVisible}
  windowBackgroundColor="rgba(255, 255, 255, .5)"
  overlayBackgroundColor="red"
  width="auto"
  height="auto"
>
  <Text>Hello from Overlay!</Text>
</Overlay>;

<Overlay
    isVisible={this.state.isVisible}
    onBackdropPress={() => this.setState({ isVisible: false })}
>
    <Text>Hello from Overlay!</Text>
</Overlay>;

export default Overlay;