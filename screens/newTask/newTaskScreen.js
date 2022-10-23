import React,  { useEffect }  from "react";
import { TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, View, Text, FlatList,Dimensions,
    Alert  } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useSelector} from 'react-redux'
import {useDispatch} from "react-redux";
import {updateNewTaskField}  from '../../features/OrderFilters/newTaskSlice'
import moment from 'moment'

const { width } = Dimensions.get('screen');



const calcSlots = (calcDate, slotInterval,add1) => {

    //console.log(calcDate)
    let x = {
        slotInterval: slotInterval,
        closeTime: '24:00'
      };
      
    //Format the time
    let startTime = moment(calcDate , "HH:mm A");
    startTime = moment(startTime).add(5+add1, "minutes")
    
    let remainder = slotInterval - (startTime.minute() % slotInterval);
    //console.log('hhhhh', remainder);
    startTime = moment(startTime).add(remainder, "minutes")
    
    //Format the end time and the next day to it 
    let endTime = moment(x.closeTime, "h:mm A")
    //console.log('startime', startTime, endTime )


    //console.log(startTime)
    
    //Times
    let morningSlotx = [];
    let afternoonSlotsx = [];
    let eveningSlotsx = [];
    
    //Loop over the times - only pushes time with 30 minutes interval
    while (startTime < endTime) {
    
    //Push times
    if (startTime <= moment("12:00", "h:mm A")){
        morningSlotx.push(startTime.format("h:mm A"));
    }
    if (startTime > moment("12:00", "h:mm A") && startTime <=moment("18:00", "h:mm A")) {
        afternoonSlotsx.push(startTime.format("h:mm A"));
    }
        if (startTime > moment("18:00", "h:mm A")) {
        eveningSlotsx.push(startTime.format("h:mm A"));
    }
    startTime.add(x.slotInterval, 'minutes');
    }
    
    // Redux de slots


    return[
        morningSlotx,
        afternoonSlotsx,
        eveningSlotsx
    ]
}




const NewTask = ({ navigation }) => {


    const stateNewtask = useSelector(state =>state.newtaskSlice)
    slotsSB = calcSlots(moment(),30,0)

    // Capturando fecha actual
    let today = moment()
    let datexSB = today
    let datexEB = datexSB

    // Capturando el primer slot disponible para el dia Start Date
    let fisrtsSlotSB = ""
    if (slotsSB[0].length >0){
            fisrtsSlotSB = slotsSB[0][0]
    }else{if (slotsSB[1].length >0){
            fisrtsSlotSB = slotsSB[1][0]
            }else{if (slotsSB[2].length >0){
            fisrtsSlotSB = slotsSB[2][0]
            }
        }
    }

    slotsEB = calcSlots(today,40,5)
    let fisrtsSlotEB = ""
    if (slotsEB[0].length >0){
        fisrtsSlotEB = slotsEB[0][0]
    }else{if (slotsEB[1].length >0){
        fisrtsSlotEB = slotsEB[1][0]
            }else{if (slotsEB[2].length >0){
                fisrtsSlotEB = slotsEB[2][0]
            }
        }
    }

    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(updateNewTaskField({"key":"job_inicio_plan_date", "value": datexSB.format()}))
        dispatch(updateNewTaskField({"key":"job_inicio_plan_time", "value": fisrtsSlotSB}))
        dispatch(updateNewTaskField({"key":"slotsSB", "value": slotsSB}))

        dispatch(updateNewTaskField({"key":"job_fin_plan_date", "value": datexEB.format()}))
        dispatch(updateNewTaskField({"key":"job_fin_plan_time", "value": fisrtsSlotEB}))
        dispatch(updateNewTaskField({"key":"slotsEB", "value": slotsEB}))

    }, [])


    function selectDateInfo() {

        return (
            <View style={{ backgroundColor: Colors.blackColor, width:width, height: 150  }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:10 }}>
                    <MaterialCommunityIcons name="numeric-1-circle-outline" size={22} color={Colors.whiteColor} />
                    <Text style={{ ...Fonts.whiteColor17Regular, marginVertical: Sizes.fixPadding , marginLeft:10}}>
                        Dates Selection
                    </Text>
                </View>
                <View style={styles.startAndEndDateWrapStyle}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('TimeSlotScreenStartBefore')}
                        style={{
                            paddingLeft: Sizes.fixPadding * 2.0,
                            ...styles.startAndEndDateStyle, alignItems: 'center',alignContent: 'center'
                        }}>
                        <View>
                            <Text style={{
                                ...Fonts.blackColor15Bold,
                                paddingBottom: Sizes.fixPadding - 5.0,
                                
                            }}>
                                START DATE
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="calendar" size={17} color={Colors.grayColor} />
                                <Text style={{ ...Fonts.blackColor14Regular,alignContent: 'center', marginLeft:5 }}>
                                    {moment(stateNewtask[0]["job_inicio_plan_date"]).format('MM-DD-YYYY').toString() }
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="clock" size={17} color={Colors.grayColor} />
                                <Text style={{ ...Fonts.blackColor14Regular,alignContent: 'center', marginLeft:5 }}>
                                {stateNewtask[0]["job_inicio_plan_time"]}
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons
                            name="keyboard-arrow-down"
                            size={22}
                            color={Colors.grayColor} />
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: Colors.blackColor,
                        width: 1.0,
                        height: 90.0,
                    }}>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('TimeSlotScreenEndBefore')}
                        style={{
                            paddingRight: Sizes.fixPadding * 2.0,
                            ...styles.startAndEndDateStyle, alignItems: 'center',alignContent: 'center'
                        }}>
                        <View>
                            <Text style={{
                                ...Fonts.blackColor15Bold,
                                paddingBottom: Sizes.fixPadding - 5.0,
                                
                            }}>
                                END DATE
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="calendar" size={17} color={Colors.grayColor} />
                                <Text style={{ ...Fonts.blackColor14Regular,alignContent: 'center', marginLeft:5 }}>
                                {moment(stateNewtask[0]["job_fin_plan_date"]).format('MM-DD-YYYY').toString() }
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="clock" size={17} color={Colors.grayColor} />
                                <Text style={{ ...Fonts.blackColor14Regular,alignContent: 'center', marginLeft:5 }}>
                                {stateNewtask[0]["job_fin_plan_time"]}
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons
                            name="keyboard-arrow-down"
                            size={22}
                            color={Colors.grayColor} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

  
    return (
        
        <SafeAreaView style={{ flex: 1, }}>

            <StatusBar />
            <View style={{ flex: 1 }}>
                <Text>
                    {selectDateInfo()}
                </Text> 
            </View>
        </SafeAreaView>
    )
    
}

NewTask.navigationOptions = () => {
   
      
}







const styles = StyleSheet.create({
    earningListWrapStyle: {
        top: -10.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: '#F4F4F4',
        borderTopLeftRadius: Sizes.fixPadding + 3.0,
        borderTopRightRadius: Sizes.fixPadding + 3.0,
    },
    earningListItemWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
    },
    totalEarningInfoWrapStyle: {
        backgroundColor: Colors.primaryColor,
        height: 120.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        height: 60.0,
        marginHorizontal: Sizes.fixPadding * 2.0
    },
    calenderCancelOkButtonWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: Sizes.fixPadding,
        marginRight: Sizes.fixPadding + 10.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    selectDateWrapStyle: {
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        backgroundColor: Colors.primaryColor,
        height: 100.0,
        justifyContent: 'space-between',
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
    },
    selectDateInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding * 2.0,
        borderColor: '#ECECEC',
        borderWidth: 1.0,
        elevation: 1.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 10.0,
    },
    startAndEndDateWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding + 5.0,
        borderColor: Colors.blackColor,
        height: 90.0,
        borderWidth: 1.0,
        marginLeft: 10,
        marginRight: 10
    },
    startAndEndDateStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 0.45,
    },
    startToEndDateWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Sizes.fixPadding + 5.0
    },
    ruleInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding * 2.0,
        borderColor: '#ECECEC',
        borderWidth: 1.0,
        elevation: 1.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 10.0,
    },
    additionalRuleInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding * 2.0,
        borderColor: '#ECECEC',
        borderWidth: 1.0,
        elevation: 1.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 10.0,
    },
    bookNowButtonOuterWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        borderTopColor: '#ECECEC',
        borderTopWidth: 1.0,
        height: 75.0,
        paddingHorizontal: Sizes.fixPadding * 2.0
    },
    bookNowButtonWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding + 5.0,
        height: 55.0,
        width: '100%',
    },
    dateAndGuestWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding + 5.0,
        borderColor: Colors.blackColor,
        height: 90.0,
        borderWidth: 1.0,
    },
    dateAndGuestStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 0.45,
    },
    dateAndTimeWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Sizes.fixPadding + 5.0
    },
    addAndSubtractGuestIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30.0,
        height: 30.0,
        borderRadius: 15.0,
    },
    numberOfGuestsWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    saveButtonStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 55.0,
        marginTop: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding + 5.0,
    }
})

export default withNavigation(NewTask );

