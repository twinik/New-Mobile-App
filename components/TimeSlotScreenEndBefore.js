import React, { useEffect }  from "react";
import CalendarStrip from 'react-native-calendar-strip';
import { Text, View, TouchableOpacity, StatusBar, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import { Fonts, Colors, Sizes } from "../constant/styles";
import moment from 'moment'
import { MaterialIcons } from '@expo/vector-icons';
import {useSelector} from 'react-redux'
import {updateNewTaskField}  from '../features/OrderFilters/newTaskSlice'
import {useDispatch} from "react-redux";


const { width } = Dimensions.get('screen');


const TimeSlotScreenEndBefore = () => {

    console.log()
    const stateNewtask = useSelector(state =>state.newtaskSlice)
    //console.log('HEREEEEEEEEE:', stateNewtask[0].slotsEB)

    let date_ini = moment()
    //let slots = calcSlots(moment(),false)

    let slots = stateNewtask[0].slotsEB
    let fisrtsSlot = stateNewtask[0].job_fin_plan_time

    // Capturando el primer slot disponible para el dia
    
    const [morningSlots  , setmorningSlots] = React.useState(slots[0])
    const [afternoonSlots, setafternoonSlots] = React.useState(slots[1])
    const [eveningSlots  ,  seteveningSlots] = React.useState(slots[2])


    const [selectedSlotSB, setselectedSlotSB] = React.useState(fisrtsSlot);
    const [bookSB, setbookSB] = React.useState(false);
    const [datexSB, setdatexSB] = React.useState(moment(stateNewtask[0].job_fin_plan_date));

    console.log('dateStartBefore: ',datexSB)
    console.log('slotStartBefore: ',selectedSlotSB)

    const dispatch = useDispatch()
    function setUpdateNewTaskField(item_field){
        dispatch(updateNewTaskField(item_field))
    }


    useEffect(() => {
        defaultslots(datexSB)
    }, [])

    function slotsInfo({ image, data }) {
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding * 2.0,
        }}>
            <Image source={image}
                style={{ height: 30.0, width: 30.0 }}
                resizeMode="contain"
            />
            <Text style={{ ...Fonts.black18Bold, marginLeft: Sizes.fixPadding }}>{data.length} Slots</Text>
        </View>
    }

    function slotsTime({ slots, time }) {

        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity onPress={() => {
                    setselectedSlotSB(`${item}`)
                    setbookSB(true)
                    setUpdateNewTaskField({"key":"job_fin_plan_time", "value": `${item}`})
                }}>
                    <View style={{
                        backgroundColor: selectedSlotSB != `${item}` ? Colors.primary : '#333333',
                        borderColor: selectedSlotSB == `${item} ` ? Colors.primary : '#CDCDCD',
                        ...styles.slotContainerStyle,
                    }}>
                        <Text style={
                            (selectedSlotSB != `${item}`) ?
                                { ...Fonts.white17Regular }
                                :
                                { ...Fonts.whiteColor16Regular }
                        }>
                            {item} {time}
                        </Text>
                    </View>
                </TouchableOpacity >
            )
        }

        return (
            <View>
                <FlatList
                    data={slots}
                    keyExtractor={(index) => `${index}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    numColumns={4}
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding * 2.0 }}
                />
            </View>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                setselectedSlotSB(`${item} `)
                setbookSB(true)
                setUpdateNewTaskField({"key":"job_fin_plan_time", "value": `${item}`})
            }} >
                <View style={{
                    borderColor: selectedSlotSB == `${item} ` ? Colors.primary : '#CDCDCD',
                    backgroundColor: selectedSlotSB != `${item} ` ? Colors.primary : '#333333',
                    ...styles.slotContainerStyle,
                }}>
                    <Text style={
                        (selectedSlotSB != `${item} `) ?
                            { ...Fonts.white17Regular }
                            :
                            { ...Fonts.whiteColor16Regular }}
                    >{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const datesBlacklistFunc = date => {
        return date<date_ini;
    }

    function defaultslots(selectedDate){
        let today = moment()
        //console.log('here', selectedDate.format('YYYY-MM-DD'),today.format("YYYY-MM-DD"))
        if (selectedDate.format('YYYY-MM-DD') != today.format("YYYY-MM-DD")){
            let s1 = ["00:00 AM", "00:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
            "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM",
            "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
            "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]
            let s2 = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
            "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"]
            let s3 = ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM" ,
            "11:00 PM", "11:30 PM"]
            setmorningSlots(s1)
            setafternoonSlots(s2)
            seteveningSlots(s3)
            console.log('dif dia')
        }else{
            
            setmorningSlots(slots[0])
            setafternoonSlots(slots[1])
            seteveningSlots(slots[2])
            setselectedSlotSB(fisrtsSlot)
            //console.log('mismo dia')
        }

    }

    function onDateSelected (selectedDate) {
        setdatexSB(selectedDate)
        console.log('ONSELECT 1 ', datexSB)
        defaultslots(selectedDate)
        setUpdateNewTaskField({"key":"job_fin_plan_date", "value": selectedDate.format()})
        
        

    }


    function calander() {
        return (
            <View>
                <View style={{}}>
                    <CalendarStrip
                        style={{ height: 120, paddingTop: Sizes.fixPadding * 2.0, paddingBottom: Sizes.fixPadding, }}
                        highlightDateContainerStyle={{
                            backgroundColor: Colors.blackColor,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        dateNumberStyle={{ color: 'black', fontSize: 17.0 }}
                        dateNameStyle={{ color: 'black', fontSize: 15.0 }}
                        highlightDateNameStyle={{ color: 'white', fontSize: 15.0 }}
                        highlightDateNumberStyle={{ color: 'white', fontSize: 17.0 }}
                        //datesBlacklist={datesBlacklistFunc}
                        disabledDateOpacity={0.6}
                        disabledDateNameStyle={{ color: 'gray', fontSize: 15.0 }}
                        disabledDateNumberStyle={{ color: 'gray', fontSize: 17.0, }}
                        selectedDate={datexSB}
                        minDate ={date_ini}
                        useIsoWeekday={false}
                        scrollable={true}
                        upperCaseDays={false}
                        styleWeekend={true}
                        onDateSelected={onDateSelected}
                    />
                </View>
            </View>
        );
    }

    function divider() {
        return (
            <View style={styles.dividerStyle}>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar  />
            {
                <View style={{ flex: 1}}>
                    <View style={{flexDirection: 'row', height:60,  paddingLeft: 10,
                                   backgroundColor: Colors.primaryColor, alignItems: 'center',
                                  
                                    }}>
                        <MaterialIcons style={{marginTop: -10}} 
                            name="date-range" size={20}
                            color={Colors.whiteColor } 
                            
                        />
                        <Text style={{ ...Fonts.whiteColor16Regular, marginLeft:10, marginTop: -10}}>
                             Date: {datexSB.format("MM-DD-YYYY")} | Time: {selectedSlotSB}
                        </Text>
                    </View>
                    <View style={{ flex: 1,  top: -15.0,
                                    left: 0.0,
                                    right: 0.0,
                                    backgroundColor: Colors.whiteColor,
                                    borderTopLeftRadius: Sizes.fixPadding + 3.0,
                                    borderTopRightRadius: Sizes.fixPadding + 3.0}}>
                    {calander()}
                    {divider()}
                    <FlatList
                        ListHeaderComponent={
                            <>
                                {slotsInfo({ image: require("../assets/images/sunrise.png"), data: morningSlots })}
                                {slotsTime({ slots: morningSlots, time: '' })}
                                {slotsInfo({ image: require("../assets/images/sun.png"), data: afternoonSlots })}
                            </>
                        }
                        data={afternoonSlots}
                        renderItem={renderItem}
                        keyExtractor={(index) => `${index}`}
                        numColumns={4}
                        ListFooterComponent={
                            <>
                                {slotsInfo({ image: require("../assets/images/sun-night.png"), data: eveningSlots })}
                                {slotsTime({ slots: eveningSlots, time: '' })}
                            </>
                        }
                        contentContainerStyle={{
                            paddingHorizontal: Sizes.fixPadding,
                            paddingBottom: bookSB ? Sizes.fixPadding * 8.0 : Sizes.fixPadding * 2.0
                        }}
                    />
                    </View>
                </View>
            }

        </View>)
}





TimeSlotScreenEndBefore.navigationOptions = {
    title: 'Edit End date selection',
    headerTitleStyle: { ...Fonts.black20Bold, marginLeft: -Sizes.fixPadding * 2.0 },
    headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    }
}

const styles = StyleSheet.create({
    doctorImageContainerStyle: {
        height: 90.0,
        width: 90.0,
        borderRadius: 45.0,
        backgroundColor: 'white',
        borderColor: '#B3BCFC',
        borderWidth: 1.0,
        marginRight: Sizes.fixPadding,
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 3.0,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: Sizes.fixPadding,
        elevation: 20.0,
        overflow: 'hidden',
    },
    slotContainerStyle: {
        alignItems: 'center',
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        marginBottom: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
        borderWidth: 1.0,
        marginRight: Sizes.fixPadding * 2.0,
        height: 45.0,
        width: 70.0,
    },
    bookSBButtonStyle: {
        backgroundColor: Colors.primary,
        paddingVertical: Sizes.fixPadding + 3.0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding + 5.0,
    },
    bookSBNowContainerStyle: {
        backgroundColor: 'white',
        height: 75.0,
        position: 'absolute', bottom: 0.0, width: '100%',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
    },
    dividerStyle: {
        backgroundColor: Colors.lightGray,
        height: 0.90,
        width: '100%',
        marginBottom: Sizes.fixPadding
    }
})

export default TimeSlotScreenEndBefore;