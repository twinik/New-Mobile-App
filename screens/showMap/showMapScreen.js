import React, { Component, useRef ,useEffect } from "react";
import * as Location from 'expo-location';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, 
        ScrollView, BackHandler, Image, Dimensions, TouchableOpacity,
        TouchableHighlight } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import Constants from 'expo-constants';
import { agents_data, mapDarkStyle, mapStandardStyle, tasks_data } from '../../model/mapData';



const { width, height } = Dimensions.get('screen');

const markerImage = require('../../assets/images/markers/agent_me.png')

const GOOGLE_MAPS_KEY =  Constants.manifest.extra.GOOGLE_MAPS_KEY

const Images = [
    { image: require("../../assets/images/markers/agent_bussy.png")},
    { image: require("../../assets/images/markers/agent_free.png") },
    { image: require("../../assets/images/markers/agent_offline.png") },
    { image: require("../../assets/images/markers/task_assigned.png")},
    { image: require("../../assets/images/markers/task_completed.png") },
    { image: require("../../assets/images/markers/task_pending.png") },
];



const ShowMapScreen = ({navigation}) => {

    const [darkMapStyle,setdarkMapStyle] = React.useState(true)

    function componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton.bind());
    }

    function componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton.bind());
    }

    const handleBackButton = () => {
        navigation.navigate("BottomTabBar");
        return true;
    };

    const state = {
        showDialog: false,
        orderCompleted: false,
    }


    const [origin, setOrigin] = React.useState({
        latitude:  4.7930579,
        longitude:  -74.060977,
      });   

    const [destination, setDestination] = React.useState({
     
      });
    
    const [newMarker, setnewMArker] = React.useState(false)
    const [isoCountry, setisoCountry ] = React.useState('us')
    const [totaskRoute, settotaskRoute] = React.useState(false)
    const [time,setTime] =  React.useState("")
    const [distance,setDistance] =  React.useState("")
    const [stats,setStats] =  React.useState(false)

    const [inputState,setinputState] = React.useState("")

    React.useEffect(() => {
        getLocationPermission();
      
      }, [])

    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted') {
          alert('Permission denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const current = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
        //console.log(current)
        setOrigin(current);
      }

    async function getCountry(lat,long){
        await Location.reverseGeocodeAsync({
            latitude : lat,
            longitude: long,
          }).then((res) => {
            setisoCountry(res[0].isoCountryCode)
            }
            ).catch(error => alert(error));
        
    }



    
    function darkIcon() {
        
        
        return (
            
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    if (darkMapStyle==false){ setdarkMapStyle(true); } 
                    else { setdarkMapStyle(false)  }
                }}
                style={{
                    ...styles.iconWrapStyle,
                    bottom: - height +280
                   
                    
                     
                }}>
                <MaterialCommunityIcons name={darkMapStyle? "weather-sunny" : "moon-waning-crescent"}
                 size={27} color={Colors.primaryColor} />

            </TouchableOpacity>
        )
    }

    function add_task_buttom() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                // onPress={() => {
                //     if (darkMapStyle==false){ setdarkMapStyle(true); } 
                //     else { setdarkMapStyle(false)  }
                // }}
                style={{
                    ...styles.iconWrapStyle,
                    bottom: - height +200
                }}>
                
                <MaterialCommunityIcons name="plus"
                size={27} color={Colors.primaryColor}
                onPress={() => navigation.navigate('NewTask')} />

            </TouchableOpacity>
        )
    }



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {/* //{header()} */}
                {mapInfo()}
                {routeInfo()}
                
                
            </View>
            {darkIcon()}
            {add_task_buttom()}
           
            
        </SafeAreaView>
    )
    

    function mapInfo() {

        getCountry(origin.latitude,origin.longitude,)
        
      
        const ref = useRef();
        
        useEffect(() => {
            ref.current?.setAddressText('');
        }, []);


        function chage_search_input(value){
            ref.current?.setAddressText(value);
        }

        return (
            <View>
                <GooglePlacesAutocomplete 
                    ref={ref}
                    placeholder="Search location..."
                    fetchDetails={true}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        //console.log(data, details)
                        setDestination({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        })
                        setnewMArker(true)
                        settotaskRoute(false)
                    }}
                    query={{
                        key: "AIzaSyActh51wdWjdEYm7_iCF3T4zNp_8X0r6mo",
                        language: "en",
                        components: "country:" + isoCountry,
                        location: `${origin.latitude}, ${origin.longitude}`
                    }}
                    textInputProps={{
                        clearButtonMode: 'never',
						
                       }}
                    styles={{
                        container: { flex: 1, position: 'absolute', width: "100%", zIndex: 1},
                        listView: { backgroundColor: "white" },
                        textInputContainer: {
                            flexDirection: 'row', 
                        },
                        textInput: {
                            backgroundColor: Colors.whiteColor,
                            height: 44,
                            borderRadius: 0,
                            borderTopColor:'gray',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            fontSize: 15,
                            flex: 1,
                            zIndex:2
                            
                          },
                          powered: {},
                    }}
                    
			/>
                <MapView
                    style={{
                        height: height,
                    }}
                    initialRegion={{
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.25
                        
                    }}
                    customMapStyle={darkMapStyle? mapDarkStyle : mapStandardStyle}
                    onPress={() => {
                        setnewMArker(false)
                        settotaskRoute(false)
                        chage_search_input("")
                        setStats(false)
                        }}
                    //mapType="terrain"
                >   
                    <Circle center={{
                        latitude: origin.latitude,
                        longitude: origin.longitude,  }} 
                        radius={5000} 
                        strokeColor = {darkMapStyle? 'orange' : 'black'}
                        fillColor = 'rgba(100,100,100,0.4)'
                        
                        />

                    <Marker 
                        //draggable
                        coordinate={origin}
                        image={markerImage}
                        //onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                        title = 'Me'
                        description = 'Click over unassigned task to see Route, time and distance'
                    />


                    {newMarker?( 
                        <Marker 
                            draggable
                            coordinate={destination}
                            onDragEnd={(direction) => {setDestination(direction.nativeEvent.coordinate)
                                chage_search_input("")}
                            }
                        />)
                    :null}

        
                    {agents_data.map((val, i) => {
                    
                        var imga =""
                        if (val.description =="Free"){ imga = Images[1].image} 
                        if (val.description =="Bussy"){ imga = Images[0].image} 
                        if (val.description =="Offline"){ imga = Images[2].image}
                        
                        var coor_dest = {
                            latitude:  val.coords.latitude,
                            longitude: val.coords.longitude,
                        }

                        return (    
                            <Marker
                                key={val.id}
                                coordinate={val.coords}
                                image = {imga}
                                title = {val.title}
                                description = {val.description}
                                onPress={(e) => {e.stopPropagation(); 
                                    //console.log(val.title,coor_dest)
                                    setDestination(coor_dest)
                                    setnewMArker(false)
                                    settotaskRoute(true)
                                    setinputState("")
                                    chage_search_input("")
                                    }}
                            >
                                
                            </Marker>
                            
                        )
                    })}

                    {tasks_data.map((val, i) => {
                        var imgt =""
                        if (val.description =="ASSIGNED"){ imgt = Images[3].image} 
                        if (val.description =="COMPLETED"){ imgt = Images[4].image} 
                        if (val.description =="PENDING"){ imgt = Images[5].image}
                        var coor_dest = {
                            latitude:  val.coords.latitude,
                            longitude: val.coords.longitude,
                        }
                        
                        return (    
                            <Marker
                                key={val.id}
                                coordinate={val.coords}
                                image={imgt}
                                title = {val.title}
                                description = {val.description}
                                onPress={(e) => {e.stopPropagation(); 
                                    //console.log(val.title,coor_dest)
                                    setDestination(coor_dest)
                                    setnewMArker(false)
                                    settotaskRoute(true)
                                    setinputState("")
                                    chage_search_input("")
                                    }}
                            />
                        )
                    })}



                    {newMarker?( 
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey="AIzaSyActh51wdWjdEYm7_iCF3T4zNp_8X0r6mo"
                        strokeColor={darkMapStyle? "white": "black"}
                        strokeWidth={5}
                        onReady={result => {
                            setTime(result.distance)
                            setDistance(result.duration)
                            setStats(true)
                            
                        }}

                        />):null}

                    
                    {totaskRoute?( 
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey="AIzaSyActh51wdWjdEYm7_iCF3T4zNp_8X0r6mo"
                        strokeColor={darkMapStyle? "white": "black"}
                        strokeWidth={5}
                        onReady={result => {
                            setTime(result.distance)
                            setDistance(result.duration)
                            setStats(true)
                        }}

                        />):null}

                </MapView >
            </View>
        )
    }

    function orderCompletedDialog() {
        return (
            <Dialog.Container visible={state.orderCompleted}
                contentStyle={styles.orderCompletedDialogStyle}
                headerStyle={{ margin: 0.0, padding: 0.0, }}
            >
                <View style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    borderRadius: Sizes.fixPadding
                }}>
                    <View style={styles.orderCompletedIconWrapStyle}>
                        <MaterialIcons name="done" size={40} color={Colors.primaryColor} />
                    </View>
                    <Text style={{ ...Fonts.grayColor17Medium, marginBottom: Sizes.fixPadding * 4.0 }}>
                        Congratulation! Order Completed.
                    </Text>
                </View>
            </Dialog.Container>
        )
    }

    function detailDiolog() {
        return (
            <Dialog.Container visible={state.showDialog}
                contentStyle={styles.dialogContainerStyle}
                headerStyle={{ margin: 0.0, padding: 0.0, }}
            >
                <View style={{
                    backgroundColor: 'white',
                    height: height - 150,
                    borderRadius: Sizes.fixPadding
                }}>
                    {orderId()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {orderDetail()}
                        {locationDetail()}
                        {customerDetail()}
                        {routeInfo()}
                        {okButton()}
                    </ScrollView>
                </View>
            </Dialog.Container>
        )
    }

    function okButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setState({ showDialog: false })}
                style={styles.okButtonStyle}>
                <Text style={{ ...Fonts.whiteColor18Medium }}>
                    Ok
                </Text>
            </TouchableOpacity>
        )
    }

    function routeInfo() {

        if (stats ==true){

        return (
            
            <View> 
                <View style={{ flex: 1, position: 'absolute', width: "100%", zIndex: 0, marginTop:44,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor:'rgba(0,0,0, 0.1)',
                                paddingRight: 10,
                                paddingLeft: 10,
                                height:35,
                             
                }}>
                    <View style={{ flexDirection: 'row',alignItems: 'center' }}>
                        <MaterialCommunityIcons name="clock" size={20} color={Colors.blueColor} />
                        <Text style={{ ...Fonts.blueColor13Regular , marginLeft:5}}>
                            {time} min
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row',alignItems: 'center', }}>
                        <MaterialCommunityIcons name="map-marker-distance" size={20} color={Colors.blueColor} />
                        <Text style={{ ...Fonts.blueColor13Regular, marginLeft:5 }}>
                            {(Math.round(distance * 100) / 100).toFixed(2)} Km
                        </Text>
                    </View>
                </View>
            </View>  

        )
    }else{

        return null

    }
}

    function customerDetail() {
        return (
            <View style={styles.detailWrapStyle}>
                <View style={styles.detailHeaderWrapStyle}>
                    <Text style={{ ...Fonts.blackColor17Medium }}>
                        Customer
                    </Text>
                </View>
                <View style={styles.detailDescriptionWrapStyle}>
                    <View style={{ ...styles.detailSpecificWrapStyle }}>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            Name
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium, }}>
                            Allison Perry
                        </Text>
                    </View>
                    <View style={{ ...styles.detailSpecificWrapStyle }}>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            Phone
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            123456789
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    function locationDetail() {
        return (
            <View style={styles.detailWrapStyle}>
                <View style={styles.detailHeaderWrapStyle}>
                    <Text style={{ ...Fonts.blackColor17Medium }}>
                        Location
                    </Text>
                </View>
                <View style={styles.detailDescriptionWrapStyle}>
                    <View style={{ ...styles.detailSpecificWrapStyle, justifyContent: 'flex-start' }}>
                        <Text style={{ ...Fonts.blackColor15Medium, width: width / 2.6, }}>
                            Pickup Location
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium, }}>
                            28 Mott Stret
                        </Text>
                    </View>
                    <View style={{ ...styles.detailSpecificWrapStyle, justifyContent: 'flex-start' }}>
                        <Text style={{ ...Fonts.blackColor15Medium, width: width / 2.6 }}>
                            Delivery Location
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            56 Andheri East
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    function orderDetail() {
        return (
            <View style={styles.detailWrapStyle}>
                <View style={styles.detailHeaderWrapStyle}>
                    <Text style={{ ...Fonts.blackColor17Medium }}>
                        Order
                    </Text>
                </View>
                <View style={styles.detailDescriptionWrapStyle}>
                    <View style={styles.detailSpecificWrapStyle}>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            Deal 1
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            $430
                        </Text>
                    </View>
                    <View style={styles.detailSpecificWrapStyle}>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            7up Regular 250ml
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            $80
                        </Text>
                    </View>
                    <View style={styles.detailSpecificWrapStyle}>
                        <Text style={{ ...Fonts.blackColor15Medium }}>Delivery Charges
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Medium }}>
                            $10
                        </Text>
                    </View>
                    <View style={{
                        height: 0.50,
                        backgroundColor: Colors.lightGrayColor,
                        marginBottom: Sizes.fixPadding - 5.0
                    }} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ ...Fonts.blackColor18Medium }}>
                            Total
                        </Text>
                        <Text style={{ ...Fonts.primaryColor18Bold }}>
                            $520
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    function orderId() {
        return (
            <View style={styles.detailTitleWrapStyle}>
                <Text style={{ ...Fonts.whiteColor17Regular }}>
                    OID123456789
                </Text>
            </View>
        )
    }

    function listIcon() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setState({ showDialog: true })}
                style={{
                    bottom: 240.0,
                    ...styles.iconWrapStyle,
                }}>
                <MaterialCommunityIcons name="clipboard-text" size={27} color={Colors.primaryColor} />
            </TouchableOpacity>
        )
    }


    function phoneIcon() {
        return (
            <View style={{
                bottom: 170.0,
                ...styles.iconWrapStyle
            }}>
                <MaterialIcons name="local-phone" size={27} color={Colors.primaryColor} />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor19Bold }}>
                    Map
                </Text>
                <MaterialIcons name="arrow-back" size={24} color="black"
                    style={{
                        position: 'absolute',
                        left: 20.0,
                    }}
                    onPress={() => navigation.navigate("BottomTabBar")}
                />
            </View>
        )
    }

    function userInfo() {
        return (
            <View style={styles.userInfoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizes.fixPadding }}>
                    <Image
                        source={require('../../assets/images/user.jpg')}
                        style={{ height: 80.0, width: 80.0, borderRadius: 40.0, }}
                        resizeMode="cover"
                    />
                    <View style={{ marginLeft: Sizes.fixPadding + 2.0, }}>
                        <Text style={{ ...Fonts.blackColor18Medium }}>
                            Allison Perry
                        </Text>
                        <Text style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding, }}>
                            56 Andheri East
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        setState({ orderCompleted: true });
                        setTimeout(() => {
                            setState({ orderCompleted: false })
                            navigation.navigate('BottomTabBar')
                        }, 3000);
                    }}
                    style={styles.finishButtonStyle}>
                    <Text style={{ ...Fonts.whiteColor18Medium }}>
                        Finish
                    </Text>
                </TouchableOpacity>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60.0,
        backgroundColor: Colors.whiteColor,
    },
    finishButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.5,
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: Sizes.fixPadding * 2.0,
    },
    userInfoWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: Colors.whiteColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 150.0,
        alignItems: 'flex-start',
        paddingHorizontal: Sizes.fixPadding
    },
    iconWrapStyle: {
        position: 'absolute',
        right: 20.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        width: 60.0,
        height: 60.0,
        borderRadius: 30.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderDetailWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 70,
        alignSelf: 'center',
        margin: 0, padding: 0
    },
    detailWrapStyle: {
        
        backgroundColor: 'transparent',
        marginVertical: Sizes.fixPadding,
        position:'relative',
        width: width 
    },
    detailHeaderWrapStyle: {
        backgroundColor: Colors.lightGrayColor,
        paddingVertical: Sizes.fixPadding - 2.0,
        alignItems: 'center',
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0
    },
    detailDescriptionWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: '#F6F6F6',
        borderWidth: 1.0,
        elevation: 0.70,
        padding: Sizes.fixPadding,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0,
        borderBottomRightRadius: Sizes.fixPadding - 5.0,
    },
    detailSpecificWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Sizes.fixPadding - 5.0
        
    },
    detailTitleWrapStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
    },
    okButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding - 2.0,
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        marginVertical: Sizes.fixPadding,
    },
    orderCompletedDialogStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 90,
        alignSelf: 'center',
    },
    orderCompletedIconWrapStyle: {
        height: 70.0,
        width: 70.0,
        borderRadius: 35.0,
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Sizes.fixPadding * 2.0,
    }
});

ShowMapScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(ShowMapScreen);