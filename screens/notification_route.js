import React from 'react';
import {URL,imageUrl} from '../api';

 export async function route_notificationTojob(job_id){


        var response=[];
   await getData(job_id).then(res=>{response=res
   
   console.log(response)
return response})
console.log(response)
return response
    
}
export function route_notificationToNotice(notice_url){

    if(notice_url.includes(".pdf")){
        return("pdf")
    }else if(notice_url.includes(".jpg"||notice_url.includes(".png"))){
        return("jpg")
    }

}
getData=(job_id)=>{
   return fetch(URL+"/get_job_details_by_order_id",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
       },
       method:"POST",
       body:"post_job_order_id="+job_id
       

    }).then(response=>response.json()).then(result=>{
        //console.log("result",result)
        if(result){
            console.log(result)
            return result
            
        }else{return null}

    }).catch(err=>console.log("error",err))
    
}


