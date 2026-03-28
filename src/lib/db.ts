import mongoose from "mongoose"

const mongoDbUrl = process.env.MONGODB_URL

if(!mongoDbUrl){
    throw new Error("Db not connected. ")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = { conn: null , promise: null }
}



const connectDb = async ()=>{
    try {
        if(cached.conn){
            return cached.conn
        }
        
        if(!cached.promise){
            cached.promise = mongoose.connect(mongoDbUrl).then(c=> c.connection)
        }
        
            const conn = await cached.promise
            return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDb