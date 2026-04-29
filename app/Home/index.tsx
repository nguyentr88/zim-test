import { ScreenWrapper } from "@/components";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "@/redux/reducer";
import { mapDispatchToProps, type AppAction, type RootState } from "@/redux";

interface HomeProps {}
type ReduxStateProps = ReturnType<typeof mapStateToProps>;

const HomeScreen = ({
  homeAction,
}: HomeProps & ReduxStateProps & AppAction) => {
  const onGetAllMemorableMoments = () => {
    homeAction.getAllStore();
  };

  useEffect(() => {
    onGetAllMemorableMoments();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}></View>
    </ScreenWrapper>
  );
};

const mapStateToProps = function (state: RootState) {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
