"use server";



export async function signUp(formData){
    const BACKEND_URL = 'http://localhost:4000/api/signup';

    const role = formData.get("role");
    const name = formData.get("companyName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");


    const res = await fetch(BACKEND_URL,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            role:role,
            name:name,
            email:email,
            phone:phone,
            password:password
        })

    })
    // console.log(role,'role')
    


    
    
}