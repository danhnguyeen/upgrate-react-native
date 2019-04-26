import React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import { YellowBox, View, StatusBar, NetInfo, Text, UIManager, TouchableOpacity } from 'react-native';

import { Header } from './src/components/common';
// import { Welcome } from './src/containers/welcome';
// import { News, NewsDetail } from './src/containers/news';
// import { Locations } from './src/containers/locations';
// import { Appointment, Rating } from './src/containers/appointment';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Brand from './src/containers/Brand/Brand';
import { Login, ForgetPassword } from './src/containers/Login';
import { BookingBrands, BookingBrandShops, BookTable } from "./src/containers/BookTable";
import { Register, SignUpWithPhone } from './src/containers/Register';
import { Home } from './src/containers/Home';
import Location from "./src/containers/Location/Location";
import { Account, Profile, Accumulation, Reward, AccountBooking, AccumulationDetails } from "./src/containers/Account";
import { Notification } from './src/containers/Notification';
import { QRCode, Review } from './src/containers/QRCode';

import i18n from './src/i18n';
import { brandPrimary,
  brandLight,
  textColor,
  fontSize,
  platform,
  statusBarColor
} from './src/config/variables';

const headerOptions = {
  headerBackTitle: null,
  headerTintColor: textColor,
  headerTitleStyle: {
    color: textColor
  },
  headerStyle: {
    backgroundColor: brandLight,
    borderBottomColor: brandLight
  }
};

const LoginStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      headerTransparent: true,
      headerBackTitle: null,
      headerTitleStyle: {
        color: textColor
      },
      headerStyle:{ 
        backgroundColor: 'rgba(33, 43, 52, 0.9)', 
      },
      title: i18n.t('login.signIn'),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(null)}
          style={{ paddingHorizontal: 10, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            size={30}
            color={textColor}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      )
    })
  },
  SignUp: {
    screen: SignUpWithPhone,
    navigationOptions: headerOptions
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: headerOptions
  },
  Register: {
    screen: Register,
    navigationOptions: ({ navigation }) => ({
      headerTransparent: true,
      headerBackTitle: null,
      headerTitleStyle: {
        color: textColor
      },
      headerStyle:{ 
        backgroundColor: 'rgba(33, 43, 52, 0.9)', 
      },
      title: i18n.t('login.signUp'),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(null)}
          style={{ paddingHorizontal: 10, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            size={30}
            color={textColor}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      )
    })
  }
}, {
    transitionConfig: (sceneProps) => ({
      transitionSpec: {
        duration: sceneProps.scene.route.routeName === 'Register' ? 0 : 260,
      }
    })
  });

const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      ...headerOptions,
      headerTitle: <Header navigation={navigation} />
    })
  },
  Brand: {
    screen: Brand,
    navigationOptions: headerOptions
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
const LocationStack = createStackNavigator({
  Locations: {
    screen: Location,
    navigationOptions: ({ navigation }) => ({
      ...headerOptions,
      headerTitle: <Header navigation={navigation} />
    })
  }
});

const QRCodeStack = createStackNavigator({
  QRCode: {
    screen: QRCode,
    navigationOptions: ({ navigation }) => ({
      ...headerOptions,
      headerTitle: <Header navigation={navigation} />
    })
  }
});

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

const BookingStack = createStackNavigator({
  BookingBrands: {
    screen: BookingBrands,
    navigationOptions: ({ navigation }) => ({
      ...headerOptions,
      headerTitle: <Header navigation={navigation} />
    })
  },
  BookingBrandShops: {
    screen: BookingBrandShops,
    navigationOptions: headerOptions
  },
  Booking: {
    screen: BookTable,
    navigationOptions: {
      ...headerOptions,
      headerStyle: {
        backgroundColor: brandLight,
        borderBottomColor: brandLight,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      }
    }
  }
},
{
  initialRouteName: 'BookingBrands'
});

const NotificationsStack = createStackNavigator({
  Notification: {
    screen: Notification,
    navigationOptions: headerOptions
  }
});

const ReviewStack = createStackNavigator({
  Review: {
    screen: Review,
    navigationOptions: headerOptions
  }
});

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
  Home: HomeStack,
  BookTable: BookingStack,
  QRCode: QRCodeStack,
  Location: LocationStack,
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
  login: LoginStack,
  BookTable: BookingStack,
  notification: NotificationsStack,
  Review: ReviewStack
}, {
    defaultNavigationOptions: { header: null },
    initialRouteName: 'Main'
  });
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
