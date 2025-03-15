// import { registerRootComponent } from 'expo';
// import App from './App';

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in Expo Go or in a native build,
// // the environment is set up appropriately
// registerRootComponent(App);

import { registerRootComponent } from 'expo';
import App from './App';
import { Common } from './contexts/CommonContext'; // Import Common

// Bọc App bằng Common trước khi đăng ký
const RootComponent = () => (
  <Common>
    <App />
  </Common>
);

// Đăng ký RootComponent làm thành phần gốc
registerRootComponent(RootComponent);
