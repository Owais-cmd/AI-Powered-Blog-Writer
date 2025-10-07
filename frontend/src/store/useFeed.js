import {create} from "zustand"

export const useFeed= create((set,get) => ({
   query: "" ,
   setQuery:(query)=>set({query}),
}))