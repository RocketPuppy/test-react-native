import * as React from 'react';
import { BleManager, Device } from "react-native-ble-plx";
import { View, Button, Text, StyleSheet } from 'react-native';
import * as R from "ramda";

interface State {
  devices: Array<Device>;
};

interface Props {};

class Bluetooth extends React.Component<Props, State> {
  manager: BleManager;

  constructor(props: Props) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      devices: []
    };
  }

  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
        // On iOS we need to wait for the bluetooth hardware to come up
        if (state === 'PoweredOn') {
            subscription.remove();
        }
    }, true);
  }

  scan() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }
        if (device) {
          this.setState({ devices: R.union(this.state.devices, [device]) });
        }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Start Scan" onPress={this.scan} />
        <Button title="Stop Scan" onPress={this.stopScan} />
        {this.state.devices.map((device) => (
          <Text>{device.name}</Text>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 40,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10
    }
});

export default Bluetooth;
