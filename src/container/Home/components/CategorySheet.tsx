import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Categorysheet = () => {
  return (
    <View style={styles.container}>
      <Text>Categorysheet</Text>
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

export default Categorysheet;
