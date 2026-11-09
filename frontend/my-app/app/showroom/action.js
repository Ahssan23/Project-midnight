"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";


export async function checkDashboard() {
  const cookie = await cookies();

  const token = cookie.get("access_token");

  if (!token) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    await jwtVerify(token.value, secret, {
      algorithms: ["HS256"],
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function GetShowroom() {
  const URL = "http://localhost:4000";
  const cookie = await cookies();

  const token = cookie.get("access_token");

  if (!token) {
    return null;
  }

  const res = await fetch(`${URL}/api/showroom`, {
    method: "GET",
    headers: {
      Cookie: `access_token=${token.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch showroom");
  }

  const data = await res.json();
  console.log( data,"this is DADTA FROM THE ACTION GETSHOWOROM")
  return data;
}

export async function RegisterShowroom(prevState,  formData){
  const URL = "http://localhost:4000"
  const ownerName = formData.get("ownerName");
  const email = formData.get("email");
  const showroomName = formData.get("showroomName");
  const phone = formData.get("phone");
  const password = formData.get("password");

  const Cookie = await cookies();
  const jwt_token = Cookie.get("access_token")
    if(jwt_token == null || jwt_token == undefined){
      redirect("/login");
  }

  const res = await fetch("http://localhost:4000/api/showroom",{
    method:"POST",
    headers:{"Content-Type":"application/json"
      , "Cookie":`access_token=${jwt_token.value}`
    },
    body:JSON.stringify({
      ownerName:ownerName,
      ShowroomName:showroomName,
      password:password
    })

  })

  const data = await res.json()
  console.log('THIS IS RETRUNGIND ATA', data);
  if(res.status === 409){
    return { message:"You already have a showroom"}
  }
  if(res.status === 500){
    return {message:"some error occured, try again later"};
  }
  
    return {status:200, message:"showroom created successfully"}

}

export async function checkShowroom(){
  const URL = "http://localhost:4000"
  const Cookie = await cookies();

  const jwt_token = Cookie.get("access_token");
  
  const res = await fetch(`${URL}/api/dashboard/checkShowroom`,{
    method:"GET",
    headers:{
      Authorization:`Bearer ${jwt_token.value}`
    }
  });
  
  const data = await res.json();
  if(data === true ){ 
    return true
  }
  else
   {
      return false
    }
}

export async function getShowroom(){
  const URL = "http://localhost:4000";
  const Getcookie = await cookies();
  const token  = Getcookie.get("access_token");
  const res = await fetch(`${URL}/api/dashboard/getShowroom`, {
    method:"GET",
    headers:{
      Authorization:`Bearer ${token.value}`
    }
  })
  return true;
}

export async function getCars(){
  const  URL = 'http://localhost:4000'
  const getCookie = await cookies();
  const token = getCookie.get("access_token");
  const res = await fetch(`${URL}/api/car`,{
    method:"GET",
    headers:{
      Authorization:`Bearer ${token.value}`
    }

  })
  const data = await res.json();
  console.log(res,"'THIS IS THE CAR DATA")
  return data;
}

export async function registerCar(formData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const carName = formData.get("carName")?.toString().trim();
  const carRentValue = formData.get("carRent");
  const available = formData.get("available") === "on";

  if (!carName || !carRentValue) {
    throw new Error("Car name and rent amount are required");
  }

  const carRent = Number(carRentValue);

  if (!Number.isSafeInteger(carRent) || carRent < 0) {
    throw new Error("Rent must be a non-negative integer");
  }

  const response = await fetch(
    "http://localhost:4000/api/car",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
      body: JSON.stringify({
        carName,
        carRent,
        available,
      }),
    }
  );

  const result = await response.text();

  console.log("Status:", response.status);
  console.log("Backend response:", result);

  if (!response.ok) {
    throw new Error(`Car registration failed: ${result}`);
  }

  return ;
}
