import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Mywrapper = () => {
  return (
    <View style={styles.container}>
      <Text>Mywrapper</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Mywrapper;
