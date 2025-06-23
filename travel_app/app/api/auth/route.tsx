import { SessionObject } from "@/app/interfaces"
import { MongoClient, ServerApiVersion, Long } from "mongodb"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';


export async function GET(request:NextRequest){
    const uuid = uuidv4()
    await createSession(uuid)
    return NextResponse.json({'token':uuid})
}

async function createSession(uuid:string):Promise<void>{
    const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPWD}@cluster0.g7spj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      })
    
    const database_name = "TravelApp"
    const collection_name = "Sessions"
    const freshDate = Date.now() + 5 * 24 * 60 * 60 * 1000 //add five days for token
  
    const session : SessionObject = {
      tokenName : uuid,
      freshDate : freshDate
    }
  
    try {
        await client.connect()
        const database = client.db(database_name)
        const sessions = database.collection<SessionObject>(collection_name)
        const results = await sessions.insertOne(session)

    } catch (error) {
        console.log(error)
    }
  
    return new Promise((resolve,reject)=>{
      resolve()
    })
  
  }