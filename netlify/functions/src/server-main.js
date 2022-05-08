// ========================================================================== //
// Express base setup
// ========================================================================== //
const path = require('path')
const axios = require('axios')

const express = require('express')

const router = express.Router()
const app = express()

const bodyParser = require('body-parser')
const http = require('http')
const fs = require('fs')

const socketIo = require('socket.io')

const db = require("./models");
const Role = db.role;

// read and apply variables that are sensitive based on the context .env
const dotenv = require('dotenv').config({
  path: `${process.cwd()}/.${process.env}.env`
})

// ========================================================================== //
// Server security setup
// ========================================================================== //
// const contentSecurityPolicy = require('helmet-csp');
// const session = require('express-session');
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// basic ddos protection
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: process.env.NODE_ENV === 'production' ? 40 : 10000 // limit each IP to 40 requests per windowMs (per hour)
})

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1) // trust first proxy
// if (process.env.NODE_ENV === "production")
// app.use(contentSecurityPolicy.getDefaultDirectives());
app.use(helmet())
const corsOptions = {
  origin: process.env.CORS_WHITELIST || process.env.NODE_ENV === 'development' && `http://localhost:${process.env.SERVER_PORT}`,
  credentials: false,
  methods: 'GET,POST',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.options('*', cors(corsOptions))
app.use(limiter) //  apply to all requests



// ========================================================================== //
// Sockets **for live-chat features**
// ========================================================================== //
const httpServer = http.createServer(app)
const io = socketIo(httpServer)
io.on('connection', (socket) => {
  console.log('A client connected', socket.id)
})
process.on('unhandledRejection', (err) => {
  console.error('unhandled promise rejection detected')
  console.error(err)
  process.exit(1)
})



// ========================================================================== //
// Configuration
// ========================================================================== //
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000,
  // inflate: true for if you are sending compressed data
  reviver: (key, value) => //called in JSON.parse(_, here)
    value,
  // strict: true,
  type: 'application/json',
  // verify: (req, res, buf) => {
  //   if (buf.toString('base64').length > req.headers['content-length']) {
  //     throw new Error('Request body larger than content-length!')
  //   }
  // },
}))


// ========================================================================== //
// Middleware
// ========================================================================== //
// these happen between requests, the compression below means data is compressed
// on each end of the request
// therefore it happens in the MIDDLE of the request hence MIDDLEware

// const functionName = 'standalone-aws-serverless-express-example'
// const basePath = `/.netlify/functions/${functionName}/`
// router.use(compression());
// router.use(awsServerlessExpressMiddleware.eventContext())
/* We need to set our base path for express to match on our function route */

// ========================================================================== //
// Re-usable headers you can re-use when handling request/result api requests
// ========================================================================== //

//example, with some common header types you can play around with / reasearch
const commonHeaders = {
  // 'Content-Type': 'application/json',
  // 'content-type': 'application/x-www-form-urlencoded',//default
  Accept: 'application/json, text/plain, */*',
  'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  // 'Access-Control-Allow-Credentials': true,
  // 'Access-Control-Allow-Headers':
  //   'Content-Type, Authorization, Content-Length, X-Requested-With',
  // 'cache-control': 'no-cache',
  // 'sec-fetch-dest': 'empty',
  // 'sec-fetch-mode': 'cors',
  // 'sec-fetch-site': 'same-site',
  // pragma: 'no-cache',
  // usequerystring: 'true',
};

// ========================================================================== //
// Image File utilities
// ========================================================================== //
const streamConfig = {
  // ./file-name.ext
  // {highWaterMark: 16}
}
// No more than 5mb total TODO: will upgrade host to AWs for more advanced use cases and larger files
const readImageFiles = (files) => {
  const images = []
  files.forEach((file) => {
    const { createReadStream } = file
    const stream = createReadStream(streamConfig)
    stream.on('data', (data) => images.push(data)) // transfer bye by byte in chunks
    stream.on('end', () => console.log('end :', Buffer.concat(file).toString()))
    stream.on('error', (err) => console.log('error :', err))
  })
  return images.map((file) => ({
    filename: `referencePhotos-${new Date().toDateString()}.jpg`,
    content: file,
    contentType: 'application/jpg'
  }))
}
 

// ========================================================================== //
// Mongodb  
// ========================================================================== //
db.mongoose.connect(
  process.env.MONGO_DB_AUTH,
  { useNewUrlParser: true, useUnifiedTopology: true },
)
.then(()=>{
  console.log('MongoDB connected')
  initial();
})
.catch(err => {
  console.log('MongoDB connection error:', err)
  process.exit(1)
})


// ========================================================================== //
// Atomic Operations
// ========================================================================== //
//you can pass subroutines which run when updating/inserting data, the following
// is a list of these, they are reffered to as ATOMIC OPERATTIONS
// {$set: {key.childKey(if any child key) or key.0(if the key is a array) or key(if its just a key): value}}
// $inc
// $push
// $pull
// $unset
// $rename
// $bit
// $min
// $max
// $currentDate
// $addToSet
// $pop
// $pullAll
// $pushAll
// $each
// $position
// $sort
// $geoWithin
// $geoIntersects
// $geoNear
// $text 
const atomicOperations = {
  $set: '$set',
  $inc: '$inc',
  $push: '$push',
  $pull: '$pull',
  $unset: '$unset',
  $rename: '$rename',
  $bit: '$bit',
  $min: '$min',
  $max: '$max',
  $currentDate: '$currentDate',
  $addToSet: '$addToSet',
  $pop: '$pop',
  $pullAll: '$pullAll',
  $pushAll: '$pushAll',
  $each: '$each',
  $position: '$position',
  $sort: '$sort',
  $geoWithin: '$geoWithin',
  $geoIntersects: '$geoIntersects',
  $geoNear: '$geoNear',
  $text: '$text'
}
// #region mongo utility
const defaultHeaders = {
  isBase64Encoded: false,
  multiValueHeaders: { 'Content-Type': 'application/json' }
}
const returnResFromPromise = async function (
  res,
  promise,
  chained = false,
  resConfig = {
    statusCode: 404,
    body: '',
    ...defaultHeaders,
  }
) {
  //only return results 
  if (chained) {
    return await promise.forEach((promise) =>
      promise
      .then((result) => result)
      .catch((result) => result)
    )
  }
  //return and handle results
  else {
    return await promise
      .then((result) => {
        if (process.env.NODE_ENV==='development') console.log(result)
        if(result){
          resConfig.body = JSON.stringify(result)
          resConfig.statusCode = 200
          res.send(resConfig)}
        else{
          resConfig.body = JSON.stringify(result+' did not find result from query')
          resConfig.statusCode = 404
          res.send(resConfig)
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV==='development') console.log(err)
        resConfig.body = JSON.stringify(err)
        resConfig.statusCode = 500
        res.send(resConfig)
      })
  }
}
const getResFromPromise = async function (
  res,
  promise,
  chained = false,
  resConfig = {
    statusCode: 404,
    body: '',
    ...defaultHeaders,
  }
) {
  //only return results 
  if (chained) {
    return await promise.forEach((promise) =>
      promise
      .then((result) => result)
      .catch((result) => result)
    )
  }
  //return and handle results
  else {
    return await promise
      .then((result) => {
        if (process.env.NODE_ENV==='development') console.log(result)
        if(result) return result
        else{
          resConfig.body = JSON.stringify(result+' did not find result from query')
          resConfig.statusCode = 404
          res.send(resConfig)
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV==='development') console.log(err)
        resConfig.body = JSON.stringify(err)
        resConfig.statusCode = 500
        res.send(resConfig)
      })
  }
}
// ========================================================================== //
// If you want to call multiple datbase operations in one go, use chainRequests,
// which are a reference to the below method functions
// ========================================================================== //
const chainedRequests = function (res, chainedCallbacks = [], dependent = false) {
  // if(dependent)
    // return (chainedCallbacks.reduce((prevMethod, curMethod, index) => await curMethod()))
  // else
  if(chainedCallbacks != [])
    return chainedCallbacks.forEach(async (method) => {
      console.log(method)
      return await method(true)//tell methods they are chained
    }
    )
}
const parseQuery = function (collectionType, query) {
  //based on the colleciton type, pre-process the query to fit the format correctly
}

// ========================================================================== //
// Databse methods to re-use
// ========================================================================== //
const findOne = async function (res, collection, query = {},chained=false) {
  if (query != {} && res)
    return returnResFromPromise(
      res,
      new Promise((resolve, reject) => {
        collection.findOne(query, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const find = async function (res, collection, query = {}, options,chained=false) {

  if (query != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.find(query,options).toArray((err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
    } 
const findFrom = async function (res, collections=[], query = {}, options, findFieldName, chained = false) {
  if (query != {} && res) {
    console.log(`querying database with: ${query} in ${collections[0]} and getting field -> ${findFieldName} and querying that field in another collection`)
    const returnedData =
      getResFromPromise(
        res,
        new Promise((resolve, reject) =>
        collections[0].find(query, options).toArray((err, result) => {
          if (err) reject(err)
          resolve(result)
        })).then(data=>data).catch(err=>console.log(err))
      )

    console.log(returnedData[findFieldName])
    console.log(`querying next collection: ${collections[1]} with -> ${findFieldName}`)

    const nextQuery = {"_id": returnedData[findFieldName]}
    const dataReferencingReturnedData =
    getResFromPromise(
      res,
      new Promise((resolve, reject) =>
      collections[1].find(nextQuery, options).toArray((err, result) => {
        if (err) reject(err)
        resolve(result)
      })).then(data=>data).catch(err=>console.log(err))
    )
    
    console.log(dataReferencingReturnedData)

    // return returnResFromPromise(
    //   res,
    //   returnedData
    // )
  }
}
      
const insertOne = (res, collection, query = {},options,chained=false) => {
  if (query != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.insertOne(query, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
// ========================================================================== //
// insert many takes an array of queries, where the query is the data your inserting
// ========================================================================== //
const insertMany = (res, collection, query = [],options,chained=false) => {
  if (query != [] && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.insertMany(query,options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const count = (res, collection, query = {},options,chained=false) => {
  if (query != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.count(query,options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
} 
// ============================================================================================= //
//  you MUST pass a filter, and a query to update which uses ATOMIC OPERATIONS (see above list)
// ============================================================================================ //
const updateOne = (res, collection, queryFilter, queryUpdate, options={}, chained=false) => {
  if (queryFilter != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.updateOne(queryFilter, queryUpdate, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
  else
    res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const findOneAndUpdate = (res, collection, queryFilter, queryUpdate, options={}, chained=false) => {
  if (queryFilter != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.findOneAndUpdate(queryFilter, queryUpdate, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
  else
    res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
  
// ========================================================================== //
//  you can use the following operations on updateMany methods
//  like update one, except it takes an array of query filters and updates
//  {$set: {key.childKey(if any child key) or key.0(if the key is a array) or key(if its just a key): value}}    
const updateMany = (res, collection, queryFilter, queryUpdate, options={}, chained=false) => {
  if (queryFilter != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.updateMany(queryFilter, queryUpdate, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
  else
    res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const deleteOne = (res, collection, query = {},chained=false) => {
  if (query != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.deleteOne(query, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
} 
const deleteMany = (res, collection, query={}, options ,chained=false) => {
  if (query != {} && res)
    return returnResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.deleteMany(query,options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
} 
//#endregion mongo utility

// ========================================================================== //
// API setup
// ========================================================================== //
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<h1>Hello World!</h1>')
  res.end()
})

//allow localhost requests on this server
//!! this is not recommended for production
if (process.env.NODE_ENV === "development")
  router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
  })

// ========================================================================== //
// Authentication
// ========================================================================== //
app.use((req,res,next) => {
  res.header(
    "Access-Control-allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
  );
  next();
})


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    // ========================================================================== //
    //     add roles to collection if none exist
    // ========================================================================== //
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
} 

// ========================================================================== //
// Routes
// ========================================================================== //
require("./app/routes/email.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/post.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/campaign.routes")(app);
require("./app/routes/message.routes")(app);

module.exports = { app, router }