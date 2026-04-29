import React from "react";
import { StyleSheet, View } from "react-native";
interface ScreenWrapperProps {
  children?: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "ffffff",
  },
});

export default ScreenWrapper;
