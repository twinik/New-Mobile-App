import React from "react";
import {
    Text, View, StyleSheet,  FlatList, StatusBar, ImageBackground,
    Image, TouchableHighlight, 
} from "react-native";
import { Colors, Fonts, Sizes } from '../constant/styles'
import { MaterialIcons } from '@expo/vector-icons';
import {useSelector} from 'react-redux'
import {useDispatch} from "react-redux";
import {editSelect}  from '../features/OrderFilters/projectSlice'
//import { transparent } from "react-native-paper/lib/typescript/styles/colors";

function FilterStatusProjects() {  
    
    const stateProjects = useSelector(state =>state.projects)
    //console.log(stateProjects)

    const dispatch = useDispatch()
    const selectionHandler = (item) =>{
        dispatch(editSelect(item))
    }


    const renderItem = ({ item }) => {
        
       
        return(
        <View>
            <TouchableHighlight
                underlayColor="white"
                activeOpacity={0.9}
                //onPress={() => navigation.navigate('Specialist', { name: item.name })}
                onPress={() => selectionHandler(item)}
            >    
                <View style={(!item.filterProjectInitialState)? styles.specialistInfoContainer : styles.specialistInfoContainer2 }>
                    <Text style={ (!item.filterProjectInitialState)? styles.lettersInfoContainer :styles.lettersInfoContainer2 }>
                        {item.name}
                    </Text>
                    
                </View>
                
            </TouchableHighlight>
        </View>
    )}

    return (  
        <View style={{ flex: 1, paddingTop:10 , marginBottom:10}}>
            <Text style={{
                ...Fonts.grayColor16Medium,
                //marginTop: Sizes.fixPadding,
                marginHorizontal: Sizes.fixPadding,
                textAlign: 'left',
                marginLeft:15
                }}>
                | by Team:              
                </Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data= {stateProjects}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ marginHorizontal: Sizes.fixPadding }}
            />
        </View>
    )
}


export default FilterStatusProjects


const styles = StyleSheet.create({
    specialistInfoContainer: {
        flexDirection: 'row',
        height: 35.0,
        //width: 120.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: Colors.lightGray,
        borderWidth: 1,
        marginHorizontal: 10.0,
        marginVertical: 1.0,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 2,
        marginTop:10
    },
    specialistInfoContainer2: {
        flexDirection: 'row',
        height: 35.0,
        //width: 120.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blackColor,
        borderColor: Colors.lightGray,
        borderWidth: 1,
        marginHorizontal: 10.0,
        marginVertical: 1.0,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 2,
        marginTop:10
    },
    lettersInfoContainer:{
    ...Fonts.primaryColor16Medium,
    //marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    textAlign: 'left'
    },
    lettersInfoContainer2:{
        ...Fonts. whiteColor16Regular,
        //marginTop: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        textAlign: 'left'
    }
})
