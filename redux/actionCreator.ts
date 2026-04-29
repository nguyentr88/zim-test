import { AppDispatch } from "./type";
import * as homeActionCreator from "../app/Home/action";
import { bindActionCreators } from "redux";

export const mapDispatchToProps = (dispatch: AppDispatch) => ({
	homeAction: bindActionCreators(homeActionCreator, dispatch),
});
