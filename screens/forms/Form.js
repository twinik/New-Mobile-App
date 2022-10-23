import * as React  from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert,ScrollView,TouchableOpacity } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import Constants from 'expo-constants';
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'


// Reusable Form Component
export default function Form({ template,watchFields,validate}) {

    let { fields } = template;

    const [show, setShow] = React.useState(false)
    
    const { control, handleSubmit, formState: { errors }, watch } = useForm({

      });
    
    const onSubmit = data => console.log(data);

    const [fdate,setfdate] =  React.useState('')
    
    let watchValues = watch(watchFields)
    validate(watchValues)

    //console.log('WATCH FORM', onChangeDate (watchValues[0]))



    
    const onChangeDate =(event, selectedDate, field_name) =>{
        
        console.log('FIELDNAME', field_name)
        if (selectedDate!= undefined){
            if (event.type == "set"){
                let tempdate = new Date(event.nativeEvent.timestamp)
                let fdate =  tempdate.getDate() + "/" + tempdate.getMonth()+ "/" + tempdate.getFullYear()
                console.log('ONCHANGEDATE',fdate)
                setShow(false)
                
                return(
                    fdate
                )
            }
            if (event.type == "dismissed"){
                setShow(false)
                return(
                    null
                )
            }
        }
    }


    
    const renderFields = (fields) => {
        return fields.map(field => {
            let { id,value, title,  field_type, field_name,require,maxlength,min,max} = field;

            //console.log('MOSTRAT PICHER', show)

            switch ( field_type) {
                case 'text':
                    return(
                        <View key= {id} style={{backgroundColor: 'white', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center',  backgroundColor: Colors.lightGrayColor}}>
                                <View style={{  marginLeft:6 , borderColor:Colors.primaryColor, marginBottom:4}}>
                                <MaterialCommunityIcons name="comment-text"  size={14} color={Colors.primaryColor} 
                                 />
                                </View>
                                <Text  style={{ ...Fonts.blackColor14Regular, marginLeft:6, marginRight:10, marginBottom:4 
                                }}>
                                    {title}
                                </Text>
                                <Text  style={!require? { ...Fonts.primarylightGrayColor, marginLeft:6, textAlign: 'right' }:
                                 { ...Fonts.primaryColor14Medium, marginLeft:6, textAlign: 'right',marginBottom:4 }}>
                                    *
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                rules={{
                                required: require,
                               
                                }}
                                render={({ field: { onChange, onBlur, value }, fieldState: {error} }) => (
                                    
                                        <TextInput 
                                            placeholder= ".. Add text here"
                                            style={[styles.input,{height: 70}] }
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            multiline={true}
                                            />
                                    
                                )}
                                name={field_name}
                                id={id}
                                />
                                {errors[field_name] && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ This is required!
                                </Text>}
                        
                        </View>
                    )

                case 'title':
                    return(
                        <View key= {id} style ={{alignItems: 'center',justifyContent: 'center',backgroundColor: Colors.primaryColor,
                                                marginTop:4, borderTopEndRadius:10, borderTopLeftRadius: 5}}>
                            <Text  style={{ ...Fonts.whiteColor17Regular, marginTop:4, marginBottom:4 }}>
                                {value}
                            </Text>
                        </View>

                    )

                case 'number':
                    return(
                        <View key= {id} style={{backgroundColor: 'white', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightGrayColor}}>
                                <View style={{  marginLeft:6 , borderColor:Colors.primaryColor, marginBottom:4}}>
                                <MaterialCommunityIcons name="numeric"  size={14} color={Colors.primaryColor} 
                                    />
                                </View>
                                <Text  style={{ ...Fonts.blackColor14Regular, marginLeft:6, marginRight:10, marginBottom:4 }}>
                                    {title}
                                </Text>
                                <Text  style={!require? { ...Fonts.primarylightGrayColor, marginLeft:6, textAlign: 'right' }:
                                    { ...Fonts.primaryColor14Medium, marginLeft:6, textAlign: 'right',marginBottom:4 }}>
                                    *
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                rules={{
                                    required: require,
                                    maxLength: maxlength,
                                    min:min,
                                    max: max
                                
                                    
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder= ".. Add number here"
                                        style={styles.input}
                                        keyboardType='numeric'
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        />
                                )}
                                name={field_name}
                                id={id}
                                />
                                {errors[field_name] &&  errors[field_name].type === "required" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ This is required!
                                </Text>}
                                {errors[field_name] &&  errors[field_name].type  === "maxLength" &&<Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ Max length error!
                                </Text>}
                                {errors[field_name] &&  errors[field_name].type  === "min" &&<Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ Min value error! value must be greater or equal than {min}
                                </Text>}
                                {errors[field_name] &&  errors[field_name].type  === "max" &&<Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ Max value error! value must be less or equal than {max}
                                </Text>}
                        
                        </View>
                    )

                case 'email':
                    return(
                        <View key= {id} style={{backgroundColor: 'white', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightGrayColor}}>
                                <View style={{  marginLeft:6 , borderColor:Colors.primaryColor, marginBottom:4}}>
                                <MaterialCommunityIcons name="email-open"  size={14} color={Colors.primaryColor} 
                                    />
                                </View>
                                <Text  style={{ ...Fonts.blackColor14Regular, marginLeft:6, marginRight:10, marginBottom:4 }}>
                                    {title}
                                </Text>
                                <Text  style={!require? { ...Fonts.primarylightGrayColor, marginLeft:6, textAlign: 'right' }:
                                    { ...Fonts.primaryColor14Medium, marginLeft:6, textAlign: 'right',marginBottom:4 }}>
                                    *
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                rules={{
                                    required: require,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "invalid email address"
                                        }
                                
                                }}
                                render={({ field: { onChange, onBlur, value } }  ) => (
                                    <TextInput
                                        placeholder= ".. Add email here"
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        type="email"
                                        
                                        
                                        />
                                )}
                                name={field_name}
                                id={id}
                                />
                                {errors[field_name] && errors[field_name].type === "required" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ This is required!
                                </Text>}
                                {errors[field_name] && errors[field_name].type === "pattern" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ email format wrong, include @  and not blank spaces at end!
                                </Text>}
                        
                        </View>
                    )

                case 'phone':
                    return(
                        <View key= {id} style={{backgroundColor: 'white', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightGrayColor}}>
                                <View style={{  marginLeft:6 , borderColor:Colors.primaryColor, marginBottom:4}}>
                                <MaterialCommunityIcons name="phone"  size={14} color={Colors.primaryColor} 
                                    />
                                </View>
                                <Text  style={{ ...Fonts.blackColor14Regular, marginLeft:6, marginRight:10, marginBottom:4 }}>
                                    {title}
                                </Text>
                                <Text  style={!require? { ...Fonts.primarylightGrayColor, marginLeft:6, textAlign: 'right' }:
                                    { ...Fonts.primaryColor14Medium, marginLeft:6, textAlign: 'right',marginBottom:4 }}>
                                    *
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                rules={{
                                    required: require,
                                    pattern: {
                                        value: /[+-]?\d+(?:[.,]\d+)?/i,
                                        message: "invalid email address"
                                        }
                                
                                }}
                                render={({ field: { onChange, onBlur, value } }  ) => (
                                    <TextInput
                                        placeholder= ".. Add phone number here"
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType='numeric'

                                        
                                        />
                                )}
                                name={field_name}
                                id={id}
                                />
                                {errors[field_name] && errors[field_name].type === "required" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ This is required!
                                </Text>}
                                {errors[field_name] && errors[field_name].type === "pattern" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ Phone format wrong!
                                </Text>}
                        
                        </View>
                    )

                case 'date':
                    //console.log('inside', show)
                   
                    return(
                        <View key= {id} style={{backgroundColor: 'white', }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightGrayColor}}>
                                <View style={{  marginLeft:6 , borderColor:Colors.primaryColor, marginBottom:4}}>
                                    <MaterialCommunityIcons name="calendar"  size={14} color={Colors.primaryColor} 
                                        />
                                </View>
                                <Text  style={{ ...Fonts.blackColor14Regular, marginLeft:6, marginRight:10, marginBottom:4 }}>
                                    {title}
                                </Text>
                                <Text  style={!require? { ...Fonts.primarylightGrayColor, marginLeft:6, textAlign: 'right' }:
                                    { ...Fonts.primaryColor14Medium, marginLeft:6, textAlign: 'right',marginBottom:4 }}>
                                    *
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                rules={{
                                    required: require,
                                }}
                                render={({ field: { onChange, onBlur, value  } }  ) => (
                                    <View>
                                        {show && (
                                        <DateTimePicker
                                             
                                            onChange={onChangeDate()}
                                            value = {new Date()}
                                            minimumDate = {new Date()}
                                            display = "default"
                                                                                       
                                        /> )
                                        }
                                        <TouchableOpacity onPress={() => showPicker(field_name)} > 
                                            <TextInput
                                                editable={false}
                                                placeholder= ".. Press here to add date"
                                                style={styles.input}
                                                // onChangeText={onChange}
                                                // value={fdate} 
                                            />
                                        </TouchableOpacity>

                                    </View>
                                )}
                                name={field_name}
                                id={id}
                                />
                                {errors[field_name] && errors[field_name].type === "required" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ This is required!
                                </Text>}
                                {errors[field_name] && errors[field_name].type === "pattern" && <Text 
                                style={{...Fonts.whiteColor12Regular, backgroundColor:'pink' }}
                                > ^^^ Phone format wrong!
                                </Text>}
                        
                        </View>
                    )



            }
        })
    }

    const showPicker = (name) => {
        console.log('NAME2',name)
        if(show) { 
           setShow(false)   
        }else{
          setShow(true)    
          }
      }



    return (

        <ScrollView>
        <View style={{backgroundColor: 'white', }}>
           
            {renderFields(fields)}
            <View >
                <Button
                style={styles.button}
                color
                title="Buttonx"
                onPress={handleSubmit(onSubmit)}
                />
            </View>
                
        </View>
        </ScrollView>
    );

    }


const styles = StyleSheet.create({
        label: {
          color: 'white',
          margin: 20,
          marginLeft: 0,
        },
        button: {
          marginTop: 40,
          color: Colors.primaryColor,
          height: 40,
          backgroundColor: '#ec5990',
          borderRadius: 4,
        },
        container: {
          flex: 1,
          justifyContent: 'center',
          paddingTop: Constants.statusBarHeight,
          padding: 8,
          backgroundColor: '#0e101c',
        },
        input: {
          backgroundColor: 'white',
          borderColor: 'black',
          height: 40,
          padding: 10,
          borderRadius: 4,
          flex: 1,
          
        },
      });