import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


const App = () => {
  const [state, setState] = useState({
    location: null,
    errorMessage: null,
  })

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      _getLocationAsync();
    }
  }, [])

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let geocode = await Location.getCurrentPositionAsync({});
    let location = await Location.reverseGeocodeAsync(geocode.coords);
    setState({ location });
  };

  let text = 'Waiting..';
  if (state.errorMessage) {
    text = state.errorMessage;
  } else if (state.location) {
    // text = JSON.stringify(state.location);
    text = `You are at ${state.location[0].street} ${state.location[0].name}!`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Button style={styles.button} title='update address' onPress={() => _getLocationAsync()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;