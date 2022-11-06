
import React, { Component, useState, useEffect   } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Dimensions,TouchableOpacity} from "react-native";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../../constant/styles";
import NewOrders from "../newOrders/newOrders";
import ActiveOrders from "../activeOrders/activeOrders";
import HistoryOrders from "../historyOrders/historyOrders";
import {useSelector} from 'react-redux'
import BottomSheetComponente from "./BottomSheet";
import ShowMapScreen from "../showMap/showMapScreen"
import Headermap from "./headerMap"
import {appControlslice}  from '../../features/statesapp/appControlSlice'


const { width } = Dimensions.get('screen');


const MapViewScreen =({navigation}) => {

    const [stateBottom , setstateBottom] = React.useState(false)
    const stateapp= useSelector(state =>state.appControlslice)
    //console.log(stateapp)
    



    return (
        <SafeAreaView style={{ flex: 1, }}>
            <StatusBar  />
            <View>
                {<Headermap/>}
                {<ShowMapScreen/>}
                {<BottomSheetComponente/>} 
                
            </View>
        </SafeAreaView>
    )
   
}



MapViewScreen.navigationOptions = {
        headerShown: false,
}


const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding + 5.0
    },
    specialistInfoContainer: {
        height: 100.0,
        width: 120.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: Colors.lightGray,
        borderWidth: 1.0,
        marginHorizontal: 10.0,
        marginVertical: 1.0,
        borderRadius: 15,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5.0,
    },
    surveIconAndCloseButtonWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center',
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 31,
        backgroundColor: Colors.primaryColor,
        position: 'absolute',
        bottom: 75,
        right: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1.5,
        shadowRadius: 5,
        elevation: 5,
    },
    plus: {
        fontSize: 30,
        color: '#fff',
        position: 'absolute',
        top: 2,
        left: 16,
    },
    iconWrapStyle: {
        position: 'absolute',
        right: 20.0,
        backgroundColor: Colors.primaryColor,
        elevation: 3.0,
        width: 60.0,
        height: 60.0,
        borderRadius: 30.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapStyle2: {
        position: 'absolute',
        left: 20.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        width: 60.0,
        height: 60.0,
        borderRadius: 30.0,
        alignItems: 'center',
        justifyContent: 'center',
    }

})

export default withNavigation(MapViewScreen);
