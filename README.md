# ZIM Mobile App

Ứng dụng mobile được xây dựng bằng [Expo](https://expo.dev) (React Native), hỗ trợ Android và iOS.

---

## Cài đặt

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install
```

---

## Chạy ứng dụng

```bash
npx expo start
```

Sau khi server khởi động:

- **Expo Go** — quét QR bằng app Expo Go trên điện thoại thật
- **Android Emulator** — nhấn `a` trong terminal (cần Android Studio)
- **iOS Simulator** — nhấn `i` trong terminal (chỉ macOS, cần Xcode)

Hoặc chạy thẳng lên thiết bị:

```bash
npx react-native run-android
npx react-native run-ios
```

---

## Build ứng dụng

Dự án dùng [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
npm install -g eas-cli
eas login
```

**APK (Android):**

```bash
eas build --platform android --profile preview
```

**iOS:**

```bash
eas build --platform ios --profile production
```

> Cấu hình profile nằm trong `eas.json`. Build iOS yêu cầu tài khoản Apple Developer.

---

## Giải pháp kỹ thuật

### Công nghệ

React Native Expo — file-based routing, `expo-video` cho phát video, `Animated` API của React Native cho toàn bộ animation.

---

### Hiệu ứng hover / motion

Tất cả animation đều dùng `useNativeDriver: true` để chạy trên UI thread, không đụng JS thread, đảm bảo 60fps ổn định trên máy phổ thông.

Chỉ dùng `transform` và `opacity` trong animation — tuyệt đối không animate `top`, `left`, `width`, `height` để tránh reflow.

**3D Tilt theo ngón tay**

Card active theo dõi vị trí chạm qua `onTouchMove`, tính toán `rotateX` / `rotateY` tương đối với tâm card (giới hạn `±8deg`) và `perspective: 800`. Khi nhấc ngón tay, card snap-back mượt qua `Animated.spring`. Hiệu ứng được giới hạn ở mức nhẹ (`MAX_TILT = 8`) để tránh gây chóng mặt trên mobile.

**Parallax ảnh nền**

`thumbnailBackground` dịch chuyển theo `scrollX` qua `interpolate` với `outputRange: [-40, 0, 40]`, tạo chiều sâu giữa lớp ảnh và caption khi cuộn carousel.

**Reveal overlay**

Khi card trở thành active, một lớp overlay fade-in kèm caption xuất hiện qua `Animated.timing` (duration 300ms). Caption còn có hiệu ứng `translateY` nhẹ từ dưới lên để tạo cảm giác slide-in tự nhiên.

**Scale / opacity theo vị trí scroll**

Mỗi card scale từ `0.92` → `1` → `0.92` và opacity từ `0.6` → `1` → `0.6` theo `scrollX.interpolate`, giúp card đang xem nổi bật rõ ràng so với các card bên cạnh.

**Micro-interaction nút mute**

Nhấn nút mute kích hoạt `Animated.sequence`: scale xuống `0.8` (80ms) rồi spring-back về `1`, tạo phản hồi vật lý rõ ràng.

**Expand / collapse nội dung**

Tap vào vùng text để mở rộng nội dung (ẩn seek bar), tap lại để thu gọn. Kèm `Animated.timing` trên `translateY` để nội dung trượt ra mượt mà.

---

### Carousel & gesture

Dùng `Animated.FlatList` với `snapToInterval` để snap từng card. Khi người dùng đang kéo seek bar, `scrollEnabled` của FlatList được tắt tạm thời qua `onSeeking` callback, tránh xung đột gesture.

**Vuốt để chuyển story:** tích hợp sẵn qua cơ chế snap của FlatList — vuốt ngang chuyển giữa các item, có indicator dot ở dưới phản ánh vị trí hiện tại theo `scrollX`.

**Focus-visible (bàn phím):** trên các `TouchableOpacity`, `accessibilityRole` và `accessibilityLabel` được khai báo đầy đủ, đảm bảo tab order hợp lý và trạng thái focus rõ ràng cho người dùng bàn phím / screen reader.

**Chạm lần 1 / lần 2:** card inactive nhận chạm đầu tiên qua scroll để chuyển active (hiển thị overlay, phát video). Chạm đúp trên card active mới toggle play/pause — tránh kích hoạt nhầm khi người dùng chỉ muốn cuộn.

---

### Accessibility

`AccessibilityInfo.isReduceMotionEnabled()` được đọc khi mount và lắng nghe thay đổi realtime. Khi bật:

- Scale animation → `[1, 1, 1]`
- translateY → `[0, 0, 0]`
- Tilt 3D bị tắt hoàn toàn
- Parallax ảnh nền tắt
- Duration animation rút về `0ms`

Contrast văn bản đạt WCAG AA: text trắng trên overlay tối, caption dùng `rgba(255,255,255,0.75)` trên nền video tối đảm bảo tỉ lệ tương phản đủ tiêu chuẩn.

---

### Responsive

`ITEM_WIDTH` và `CARD_HEIGHT` tính theo `DIMENSION.width` và `DIMENSION.height` — tự động điều chỉnh khi xoay thiết bị giữa Portrait và Landscape. Hiệu ứng 3D giới hạn `MAX_TILT = 8deg` — đủ để cảm nhận mà không gây khó chịu trên màn hình nhỏ.

---

### Hiệu suất & asset

- Video chỉ mount khi card active, unmount sau `800ms` delay để tránh giật khi cuộn nhanh
- `initialNumToRender: 2`, `maxToRenderPerBatch: 2`, `windowSize: 3`, `removeClippedSubviews: true` — giới hạn số lượng item render đồng thời
- `scrollEventThrottle: 16` — đồng bộ với 60fps, tránh event quá dày
- Ảnh thumbnail lazy-load qua `Animated.Image` với `fadeDuration: 200`
- Ưu tiên dùng ảnh WebP cho thumbnail để giảm dung lượng tải, độ phân giải chọn phù hợp với kích thước hiển thị thực tế của card (`75% screen width`) thay vì tải ảnh full-res
