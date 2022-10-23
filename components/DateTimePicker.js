import React, { useState } from 'react'
import { Button } from 'react-native'
import DatePicker from 'react-native-date-picker'


function DateTimePicker() {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
  
    return (
    <>
      <Button title="Open" onPress={() => setOpen(true)} />
   
      
    </>
  )
}
export default DateTimePicker

