import React, { Component, useEffect  } from "react";
import { View, TouchableOpacity, StyleSheet, Text, BackHandler, SafeAreaView, StatusBar } from "react-native";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../constant/styles";
import ProfileScreen from "../screens/profile/profileScreen";
import WalletScreen from "../screens/wallet/walletScreen";
import OrderScreen from "../screens/order/orderScreen";
import Notifications from "../screens/notifications/notificationsScreen";
import TimeSlotScreenEndBefore from "./TimeSlotScreenEndBefore";

class BottomTabBarScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    
    state = { currentIndex: 1 };

    

    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                    <StatusBar
                        translucent={false}
                        backgroundColor={Colors.primaryColor}
                    />
                    {this.state.currentIndex == 1 ?
                        <OrderScreen />
                        :
                        this.state.currentIndex == 2 ?
                            <WalletScreen />
                            :
                            this.state.currentIndex == 3 ?
                                <Notifications/>
                                :
                                <ProfileScreen />
                    }
                    <View style={styles.bottomTabBarStyle}>
                        {this.bottomTabBarItem({
                            index: 1,
                            // title: 'Tasks'
                        })}
                        {this.bottomTabBarItem({
                            index: 2,
                            // title: 'Calendar'
                        })}
                        {this.bottomTabBarItem({
                            index: 3,
                            // title: 'Notifications'
                        })}
                          {this.bottomTabBarItem({
                            index: 4,
                            // title: 'Settings'
                        })}
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    bottomTabBarItem({ index, title }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={{ alignItems: 'center' }}
                onPress={() => this.setState({ currentIndex: index })}
            >
                {index == 1 ?
                    <MaterialIcons name="home" size={35}
                        color={index == this.state.currentIndex ? Colors.primaryColor : Colors.grayColor}
                    />
                    :
                    index == 2 ?
                        <MaterialIcons name="chat" size={30}
                            color={index == this.state.currentIndex ? Colors.primaryColor : Colors.grayColor}
                        />
                        :
                        index == 3 ?
                            <MaterialIcons name="notifications" size={30}
                                color={index == this.state.currentIndex ? Colors.primaryColor : Colors.grayColor}
                            />
                            :
                            <MaterialIcons name="more" size={30}
                                color={index == this.state.currentIndex ? Colors.primaryColor : Colors.grayColor}
                            />

                        
                }

                
                {/* <Text style={
                    index == this.state.currentIndex ?
                        { ...Fonts.primaryColor14Medium }
                        :
                        { ...Fonts.grayColor14Medium }
                }>
                    {title}
                </Text> */}
            </TouchableOpacity>
        )
    }
}

BottomTabBarScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(BottomTabBarScreen);

const styles = StyleSheet.create({
    bottomTabBarStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        height: 55.0,
        borderTopLeftRadius: Sizes.fixPadding * 1.0,
        borderTopRightRadius: Sizes.fixPadding * 1.0,
        backgroundColor: Colors.whiteColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderTopColor: 'rgba(128, 128, 128, 0.1)',
        borderTopWidth: 1.0,
        elevation: 2.0
    },
})



