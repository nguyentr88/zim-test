import { ScreenWrapper } from "@/components";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { connect } from "@/redux/reducer";
import { mapDispatchToProps, type AppAction, type RootState } from "@/redux";
import { MomentItem, MomentList } from "./components";
import { DIMENSION } from "@/constant";

interface HomeProps { }
type ReduxStateProps = ReturnType<typeof mapStateToProps>;

const HomeScreen = ({
  homeAction,
  momentsData
}: HomeProps & ReduxStateProps & AppAction) => {
  const onGetAllMemorableMoments = () => {
    homeAction.getAllStore();
  };

  useEffect(() => {
    onGetAllMemorableMoments();
  }, []);

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
        <MomentList 
          momentsData={momentsData}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const mapStateToProps = function (state: RootState) {
  return {
    momentsData: state.homeReducer.memorableMoments,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F1F",
  },
  contentContainerStyle: {
    alignItems: 'center',
    paddingBottom: DIMENSION.heightBottomSafe + 8
  }
});
