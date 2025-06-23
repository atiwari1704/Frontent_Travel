import { Long } from "mongodb"

export interface SessionObject{
    tokenName : string|null,
    freshDate : number
}

export interface SearchParams{
    [key: string]: string
}