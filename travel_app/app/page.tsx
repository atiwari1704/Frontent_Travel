'use client'


import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Long, MongoClient, ServerApiVersion} from "mongodb";
import { SessionObject } from './interfaces';

interface TokenResponse{
  token:string
}


export default function Home() {
  const [tripTypeToggle,setTripTypeToggle] = useState(true)
  const [destinationToggle,setDestinationToggle] = useState(false)
  const [originToggle,setOriginToggle] = useState(false)
  const minDate = (new Date()).toJSON().slice(0,10)

  async function handleSubmit(formData:HTMLFormElement){
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE}/api/auth`,{
      method:'GET'
    })
    const params : string[][] = []
    const tokenResponse:TokenResponse = await response.json()
    const form = new FormData(formData)
    form.append('auth',tokenResponse.token)
    form.forEach((value,key,parent)=>{
      params.push([key.toString(),value.toString()])
    })

    console.log(process.env.MONGOUSER)
    const searchParams = new URLSearchParams(params)
    const path = `${process.env.NEXT_PUBLIC_SITE}/flights`

    window.location.assign(`${path}?${searchParams.toString()}`)
}


  return (
    <main className="flex min-h-screen flex-col justify-start items-center">
      <div className="flex flex-row  mt-3">
        <h1 className="text-5xl md:text-7xl lg:text-8xl">
          JourneyMaker
        </h1>
      </div>
      <form className="flex flex-col lg:flex-row justify-between items-center" action='/flights' method="GET" onSubmit={
        (event)=>{
          event.preventDefault()
          handleSubmit(event.currentTarget)
      }}>
        <div className="flex flex-col  justify-between items-center">
          <span>
            <input type="radio" value="R" name="trip" id="return" onClick={(event)=>{setTripTypeToggle(true)}} defaultChecked={true}/>
            <label htmlFor="return" className="text-center">Return</label>
          </span>
          <span>
            <input type="radio" value="O" name="trip" id="one-way" onClick={(event)=>{setTripTypeToggle(false)}}/>
            <label htmlFor="one-way" className="text-center">One-way</label>
          </span>
        </div>
        <div className="flex flex-col ">
          <input type="date" className="text-blue-500" name="depart" required={true} defaultValue={minDate} min={minDate}/>
          <p className="text-xl text-center">Departure Date</p>
        </div>
        {
          tripTypeToggle ?     
        (<div className="flex flex-col ">
          <input type="date" className="text-blue-500" name="return" required={true}/>
          <p className="text-xl text-center">Return Date</p>
        </div>) : <></>
        }
        <div className="flex flex-col ">
          <input list="airports" type="text" className="max-w-26 text-blue-500 text-center" name="origin" onChange={(event)=>setOriginToggle(true)}/>
          {originToggle ? 
            (
              <div>
                  <datalist id="airports" className="bg-white">
                    <option value="YEG"/>
                    <option value="PHL"/>
                  </datalist>
              </div>
            )
            :
            (
              <></>
            )
          }
          <p className="text-xl text-center">From</p>
        </div>
        <div className="flex flex-col ">
          <input type="text" className="max-w-26 text-center text-blue-500" name="destination"/>
          <p className="text-xl text-center">To</p>
        </div>
        <div className="flex flex-col justify-center items-center ">
          <button type="submit" className="text-center text-2xl text-white bg-blue-500 text-bpld rounded-md hover:text-slate-300 shadow-lg">Search</button>
        </div>
      </form>
    </main>
  );
}



