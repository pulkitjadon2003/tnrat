import mongoose from "mongoose";

const connection = {};

export async function connectDB() {
  if(connection.isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "tnrat",
    });

    connection.isConnected = db.connections[0].readyState;
    
    console.log("MongoDB connected");
  }catch (error) {
    console.log("MongoDB connection error:", error);
    throw new Error("MongoDB connection error");
  }
}

// // lib/mongodb.js
// import mongoose from "mongoose";

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       dbName: "tnrat",
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }
