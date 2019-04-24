import React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import { YellowBox, View, StatusBar, NetInfo, Text, UIManager } from 'react-native';

import { Header } from './src/components/common';
// import { Welcome } from './src/containers/welcome';
// import { News, NewsDetail } from './src/containers/news';
// import { Locations } from './src/containers/locations';
// import { Appointment, Rating } from './src/containers/appointment';
// import { Account, SignIn, SignUp, SignUpWithPhoneAndFacebook, Profile } from './src/containers/account';
import { Home } from './src/containers/Home';
import { Account, Profile, Accumulation, Reward, AccountBooking, AccumulationDetails } from "./src/containers/Account";
// import { Notifications } from './src/containers/notifications';
import { NotificationIcon } from './src/components/notifications';
import i18n from './src/i18n';
import { brandPrimary,
  brandLight,
  textColor,
  fontSize,
  platform,
  statusBarColor
} from './src/config/variables';

const headerOptions = {
  headerTintColor: textColor,
  headerTitleStyle: {
    color: textColor
  },
  headerStyle: {
    backgroundColor: brandLight,
    borderBottomColor: brandLight
  }
};

// const HomeStack = createStackNavigator({
//   Welcome: {
//     screen: Welcome,
//     navigationOptions: ({ navigation }) => {
//       return {
//         ...headerOptions,
//         title: i18n.t('tabs.buildingList'),
//         headerRight: <NotificationIcon navigation={navigation} />
//       }
//     }
//   },
//   News: {
//     screen: News,
//     navigationOptions: {
//       ...headerOptions,
//       title: i18n.t('tabs.news')
//     }
//   }
// }, {
//     initialRouteName: 'Welcome',
//     navigationOptions: ({ screenProps }) => {
//       return {
//         ...headerOptions,
//         tabBarLabel: i18n.t('tabs.home', screenProps.language),
//         tabBarVisible: false
//       }
//     }
//   });

const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      ...headerOptions,
      headerTitle: <Header navigation={navigation} />
    })
  }
}, {
    initialRouteName: 'Home',
    navigationOptions: ({ screenProps }) => {
      return {
        ...headerOptions,
        // tabBarLabel: i18n.t('tabs.buildings', screenProps.language),
      }
    }
  });

// const LocationStack = createStackNavigator({
//   Locations: {
//     screen: Locations,
//     navigationOptions: ({ navigation }) => {
//       return {
//         ...headerOptions,
//         title: i18n.t('tabs.locations'),
//         headerRight: <NotificationIcon navigation={navigation} />
//       }
//     }
//   }
// }, {
//     navigationOptions: ({ screenProps }) => {
//       return {
//         ...headerOptions,
//         tabBarLabel: i18n.t('tabs.locations', screenProps.language),
//       }
//     }
//   });

const AccountStack = createStackNavigator({
  Account: {
    screen: Account,
    navigationOptions: ({ navigation }) => ({
      ...headerOptions,
      headerTitle: <Header navigation={navigation} />
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      ...headerOptions,
      header: null
    }
  },
  AccountBooking: {
    screen: AccountBooking,
    navigationOptions: {
      ...headerOptions
    }
  },
  Accumulation: {
    screen: Accumulation,
    navigationOptions: {
      ...headerOptions
    }
  },
  AccumulationDetails: {
    screen: AccumulationDetails,
    navigationOptions: {
      ...headerOptions
    }
  },
  Reward: {
    screen: Reward,
    navigationOptions: {
      ...headerOptions
    }
  }
}, {
    initialRouteName: 'Account',
    navigationOptions: ({ screenProps }) => {
      return {
        ...headerOptions,
        // tabBarLabel: i18n.t('tabs.account', screenProps.language),
      }
    }
  });

// const AppointmentStack = createStackNavigator({
//   Appointment: {
//     screen: Appointment,
//     navigationOptions: ({ navigation }) => {
//       return {
//         ...headerOptions,
//         title: i18n.t('appointment.appointmentList'),
//         headerRight: <NotificationIcon navigation={navigation} />
//       }
//     }
//   }
// }, {
//     navigationOptions: ({ screenProps }) => {
//       return {
//         ...headerOptions,
//         tabBarLabel: i18n.t('tabs.appointment', screenProps.language),
//       }
//     }
//   });

// const NotificationsStack = createStackNavigator({
//   Notifications: {
//     screen: Notifications,
//     navigationOptions: headerOptions
//   }
// });
// const ModalBookingStack = createStackNavigator({
//   ModalBooking: { screen: Booking, navigationOptions: headerOptions }
// });
// const ModalNewsStack = createStackNavigator({
//   ModalNews: { screen: NewsDetail, navigationOptions: headerOptions }
// });
// const RatingStack = createStackNavigator({
//   Rating: { 
//     screen: Rating, 
//     navigationOptions: {
//       ...headerOptions,
//       title: i18n.t('review.rating')
//     }
//   }
// });
const MainNavigator = createBottomTabNavigator({
  // Home: HomeStack,
  Home: HomeStack,
  // Locations: LocationStack,
  // Appointment: AppointmentStack,
  Account: AccountStack
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOptions: {
        activeTintColor: brandPrimary,
        inactiveTintColor: '#dadada',
        style: {
          // height: 55,
          backgroundColor: brandLight,
          elevation: 0
        }
      },
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'md-home';
        } else if (routeName === 'BookTable') {
          iconName = 'md-restaurant';
        } else if (routeName === 'Location') {
          iconName = 'ios-pin';
        } else if (routeName === 'Notification') {
          iconName = `ios-notifications`;
        } else if (routeName === 'Account') {
          iconName = 'ios-person';
        } else if (routeName === 'QRCode') {
          iconName = 'qrcode-scan';
        }
        if (iconName != 'qrcode-scan') {
          return <Icon name={iconName} size={22} color={tintColor} />;
        } else return <MaterialCommunityIcons name={iconName} size={22} color={tintColor} />
      },
      tabBarLabel: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let title;
        if (routeName === 'Home') {
          title = i18n.t('tabs.home');
        } else if (routeName === 'BookTable') {
          title = i18n.t('tabs.bookingTable');
        } else if (routeName === 'Location') {
          title = i18n.t('tabs.location');
        } else if (routeName === 'Notification') {
          title = i18n.t('tabs.notification');
        } else if (routeName === 'Account') {
          title = i18n.t('tabs.account');
        } else if (routeName === 'QRCode') {
          title = 'QRCode';
        }
        return <Text style={{ fontSize: fontSize - 3, color: tintColor, lineHeight: 18, textAlign: 'center' }}>{title}</Text>
      }
    }),
    initialRouteName: 'Home'
  });

const AppNavigator = createStackNavigator({
  Main: createSwitchNavigator({ MainNavigator }),
  // ModalNews: ModalNewsStack,
  // ModalBooking: ModalBookingStack,
  // Notifications: NotificationsStack,
  // Rating: RatingStack
}, {
    defaultNavigationOptions: { header: null },
    initialRouteName: 'Main'
  });
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
