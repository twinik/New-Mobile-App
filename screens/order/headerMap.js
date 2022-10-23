
import React, { Component, useState, useEffect   } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity,StyleSheet} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../../constant/styles";

import {useSelector} from 'react-redux'
import {useDispatch} from "react-redux";
import {updateappControlsliceField} from "../../features/statesapp/appControlSlice"
import moment from 'moment'

import { withNavigation } from "react-navigation";


const Headermap= ({navigation}) => {
    const stateapp= useSelector(state =>state.appControlslice)
    const mapView = stateapp[0].map_view
    const filter_on = stateapp[0].filters_on
    //console.log('DESDE HEADER', mapView,filter_on) 

    const dispatch = useDispatch()



    function updateStateApp (item_field) {
            console.log(mapView)
            console.log('jkmom',item_field)
            dispatch(updateappControlsliceField(item_field))
        }


    var hoy = moment().toString().slice(0, 15)


    return (
        <View style={styles.headerWrapStyle}>
            
            <Text style={{ ...Fonts.blackColor18Medium }}>
                {hoy}
            </Text>
            <View style={{ flexDirection: 'row',position: 'relative', justifyContent: 'space-between'}}>
                <MaterialIcons style={{ marginRight: -10}}
                    name="filter-alt"
                    size={26}
                    color={Colors.blackColor}
                    onPress={() => {
                        if (filter_on == false){
                            updateStateApp({"key":"filters_on", "value": true})   
                        }else{
                            updateStateApp({"key":"filters_on", "value": false})
                        }       
                    }}
                    
                />
                    
                    <TouchableOpacity style={{ flexDirection: 'row', position: 'relative', justifyContent: 'space-between',
                                    backgroundColor: "white", marginLeft:20,
                                    borderRadius:3,  alignItems: 'center', borderColor: Colors.primaryColor,
                                    borderWidth :1,
                                    justifyContent: 'center',
                                    }}
                                    onPress={() => {   
                                        navigation.navigate('BottomTabBar')    
                                    }}
                                       
                                  >
                        <MaterialCommunityIcons style={{ marginLeft: 5, marginRight:5}}
                            size={20}
                            color={Colors.primaryColor}
                            name="format-list-numbered"
                      
                        />
                        <Text style={{ ...Fonts.primaryColor, marginRight:10 }}>
                            List View
                        </Text>

                     </TouchableOpacity>

            </View>
            
        </View>
    )
}




const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding + 5.0,
        zIndex:50
    },


})

export default withNavigation(Headermap)