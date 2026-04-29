import { API_CONSTANT } from "@/constant";
import { apiBase, METHOD, REQUEST_TYPE } from "@/utility";
import * as ActionType from "@/redux/actionType";
import { AppDispatch, RootState } from "@/redux/type";

const { start_get_all_memorable_moments, stop_get_all_memorable_moments } =
  ActionType;

const { API_GET_MEMORABLE_MOMENTS } = API_CONSTANT;

export const getAllStore = () => {
  return (dispatch: AppDispatch) => {
    const body = {};
    dispatch(start_get_all_memorable_moments());
    dispatch(stop_get_all_memorable_moments(MOMENTS_DATA));
    // apiBase(API_GET_MEMORABLE_MOMENTS, METHOD.POST, body)
    //   .then((response: any) => {
    //     console.log("getAllStore success", response);
    //     const { object } = response;
    //     dispatch(stop_get_all_memorable_moments(object));
    //   })
    //   .catch((error) => {
    //     console.log("getAllStore error", error);
    //     dispatch(
    //       stop_get_all_memorable_moments([], true, false, "Không có data"),
    //     );
    //   });
  };
};

const MOMENTS_DATA = [
  {
    id: "1",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "2",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "3",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "4",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "5",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "6",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "7",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "8",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "9",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  },
  {
    id: "10",
    title: "ZIM Academy - 336 Phan Xích Long - Q. Phú Nhuận",
    content: "👉Tuyển hội quyết đạt aim trong hè này.\n📢 Yêu cầu: Không cần giỏi sẵn - chỉ cần chịu học.\n✨ Phần còn lại, cứ để ZIM lo\n-----------------------------------------------\nMuốn ZIM xây cho bạn lộ trình riêng không? \n💬✨Inbox hỗ trợ: m.me/410703372123088?ref=ZIM518839\n#ZIM #TiengAnhCaNhanHoa #OneLearnerOneJourney\n------------------------------------------------\nANH NGỮ ZIM – TIẾNG ANH CÁ NHÂN HOÁ\n336 Phan Xích Long, P.7, Q.Phú Nhuận\n📞 Hotline: 1900 2833",
    videoURL: "https://social-media.zim.vn/stories/e30b7c17-f46f-407c-877d-91f43dbd2161/l31OKS-0429/l31OKS-0429.mov"
  }
];