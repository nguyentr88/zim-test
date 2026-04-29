import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Categorylist = () => {
  return (
    <View style={styles.container}>
      <Text>Categorylist</Text>
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

export default Categorylist;
