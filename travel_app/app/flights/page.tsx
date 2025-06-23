import { Long, MongoClient, ServerApiVersion} from "mongodb";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { SearchParams, SessionObject } from "../interfaces";



export default async function flights({searchParams} : {searchParams: SearchParams}){
    const authenticated = await checkAuth(searchParams)
    if (authenticated){
        return(
            <main className="flex min-h-screen flex-col justify-start items-center">
                <h1>Query recieved</h1>
                <p className="mt-6">{JSON.stringify(searchParams)}</p>
            </main>
            )
    }else{
        redirect('/')
    }


}

async function checkAuth(params:SearchParams):Promise<boolean>{
    const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPWD}@cluster0.g7spj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      })
    
    const auth_header = "auth"
    const database_name = "TravelApp"
    const collection_name = "Sessions"
    let errorMessage = ""

    try {
        const auth_key = params[auth_header]
        const query = {'tokenName':auth_key}
        await client.connect()
        const database = client.db(database_name)
        const sessions = database.collection<SessionObject>(collection_name)
        const results = await sessions.findOne(query)
        const time_now = Date.now() + 5 * 1000
        if ((results?.freshDate as number) < time_now){
            errorMessage = "TokenNotFresh"
        }
    } catch (error) {
        console.log(error)
        errorMessage = "NoAuthIncluded"
    }

    return new Promise((resolve,reject)=>{
        if (errorMessage.length > 0){
            resolve(false)
        }else{
            resolve(true)
        }
    })
}