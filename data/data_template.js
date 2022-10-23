let first_name = ["Antonio", "Maria", "Rene", "Sofia", "Ana", "lucia", "Ramon"]
let last_name =  ["Salguero", "Diaz", "Silva", "Salguero", "Silva", "ARodriguez", "MElgarejo"]
let fleet_id  =  [1001, 1002,1003,1004,1005,1006,1007]
let email = [first_name[0]+ "@gmail.com",first_name[1]+ "@gmail.com",first_name[2]+ "@gmail.com",first_name[3]+ "@gmail.com",
            first_name[4]+ "@gmail.com",first_name[5]+ "@gmail.com",first_name[6]+ "@gmail.com"]

let company  = [["ALL"], ["agnitu","rg"], ["rg"],["rg"], ["rg"], ["rg"] ,["agnitu"],["agnitu"] ]

let teams_belong = [[12345, 22222, 33333,44444], [22222], [33333,44444],
                [777777], [22222],[777777],[44444], [777777] ]

let teams_manage =  [[12345], [22222, 33333,44444], [777777,44444],
                        [], [],[],[44444], [] ]             


const traer_users = async () => {
    var startTime = performance.now()
    console.log('here')
    const usersRef= collection(database, "users");
    const q = query(usersRef, where("company", "==", "agnitu"));
    const querySnapshot = await getDocs(q);
    var endTime = performance.now()
    
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    console.log(`Call to doSomething took: ${endTime - startTime} milliseconds`)
});

}


const onSend = async () => {
    for (var i = 0; i < 6; i++) {
    
    const agent = {
            "fleet_id":fleet_id [i],
            "company" : company[i],
            "is_deleted":0,
            "dispatcher_id":"None",
            "email":email[i] ,
            "access_token":"532225d6a20658081c162b31151724451fe0ccfd29",
            "first_name":first_name[i],
            "last_name":last_name[i],
            "login_id":"asalguero",
            "tags":"",
            "username":"Antonio Salguero",
            "password":"dc483e80a7a0bd9ef71d8cf973673924",
            "phone":"+573148731345",
            "latitude":"4.7930729",
            "longitude":"-74.0610923",
            "location_update_datetime":"2022-07-29T02:05:11.000Z",
            "last_updated_local_time":"None",
            "fleet_image":"app/img/user.png",
            "fleet_thumb_image":"https://tookan.s3.amazonaws.com/fleet_thumb_profile/user.png",
            "device_type":0,
            "device_desc":"Samsung SM-A225M, AdvertisingID: e0392288-cb2f-480f-90d2-2db84f7ee72a",
            "battery_level":34,
            "has_gps_accuracy":1,
            "has_network":1,
            "store_version":"4.1.91",
            "imei_number":"013c3887e9a65435",
            "app_versioncode":"4191",
            "verification_token":"",
            "registration_status":1,
            "transport_type":0,
            "transport_desc":"",
            "license":"",
            "color":"",
            "user_id":1007545,
            "is_active":1,
            "is_available":0,
            "status":1,
            "total_rating":10,
            "total_rated_tasks":2,
            "noti_tone":"ping.caf",
            "creation_datetime":"2021-06-16T19:36:54.000Z",
            "updation_datetime":"2022-07-29T02:05:34.000Z",
            "last_login_datetime":"2022-07-29T02:04:56.000Z",
            "timezone":"300",
            "external_fleet_id":"",
            "bearing":"359.99557",
            "terms_and_conditions":1,
            "is_first_time_login":1,
            "monibyte_id":"",
            "block_reason":"None",
            "gps_device_id":"",
            "fleet_type":1,
            "is_blocked_by_subscription":0,
            "fuel_level":0,
            "vehicle_calibration_id":"None",
            "lang":"None",
            "teams_belong ": teams_belong[i],
            "teams_manage ": teams_manage[i],
        }
        
       
        const docRef = await addDoc(collection(database, 'users'), agent);
        console.log('enviado crear agente ', i)

    }
  
}