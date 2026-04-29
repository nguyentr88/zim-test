import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Imageviewer = () => {
  return (
    <View style={styles.container}>
      <Text>Imageviewer</Text>
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

export default Imageviewer;
