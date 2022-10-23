import React from 'react';
import Form from './Form'
import { withNavigation } from "react-navigation";
import {View } from 'react-native';


const FormJson = ({navigation}) => {

  let template = {
    fields: [
        {
            id: 1,
            title: '',
            value: 'PARTE 1 SINDONI NUCITA AUDITORIA',
            field_type: 'title',
            field_name: 'maintitle',
            require: false
            
        },
        {
          id: 13,
          title: 'Comentarios',
          value:'',
          field_type: 'text',
          field_name: 'comentarios',
          require: false,
        },
        {
          id: 21,
          title: 'Seleccione fecha',
          value:'',
          field_type: 'date',
          field_name: 'datepicker',
          require: false,
        },
        
        {
          id: 213,
          title: 'Seleccione fechaa 3',
          value:'',
          field_type: 'date',
          field_name: 'datepicker2',
          require: false,
        },

        {
          id: 3,
          title: 'Escriba nombre del encargado Escriba nombre del encargado Escriba nombre del encargado Escriba nombre del encargado',
          value:'',
          field_type: 'email',
          field_name: 'lasttname',
          require: false,
        },
        {
          id: 4,
          title: '',
          value: 'PARTE 2 GENICA AUDITORIA',
          field_type: 'title',
          field_name: 'maintitle',
          require: false
          
        },
        {
          id: 5,
          title: 'cvnxcvbnnxcbmv xmvncb bxncv nxcbmv',
          value:'',
          field_type: 'text',
          field_name: 'description1',
          require: false,
        },
        {
          id: 6,
          title: 'rou\iwtoieru\te oieutoetrpeort perotie',
          value:'',
          field_type: 'number',
          field_name: 'description2',
          require: false,
          maxlength: 2,
          min: 4,
          max:8
        },
        {
          id: 7,
          title: 'fadfdfdsf sdkfmoksmdf sokdmfoskdfsd',
          value:'',
          field_type: 'number',
          field_name: 'description3',
          require: false,
        },
        {
          id: 10,
          title: '',
          value: 'PARTE 3 PEPSICO',
          field_type: 'title',
          field_name: 'maintitle',
          require: false
          
        },
        {
          id: 8,
          title: 'numero de telefono del encargado',
          value:'',
          field_type: 'phone',
          field_name: 'phon',
          require: false,
        }
      
      
      ]
    
    }

    return (
        <View>

          <Form
              template={template}
              watchFields = {['datepicker','phone']}
              validate = {validate}

          />


        </View>

    );
 
}

function validate(watchValues){

  console.log('VALIDATE',watchValues)


}


export default withNavigation(FormJson);