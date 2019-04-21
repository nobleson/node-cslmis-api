// Require the fastify framework and instantiate it
const fastify = require('fastify')({
    logger: true
  })
  
  // Require external modcules
  const mongoose = require('mongoose')
  
  // Import Routes
  const routes = require('./routes')
  
  // Import Swagger Options
  const swagger = require('./config/swagger')
  
  // Register Swagger
  fastify.register(require('fastify-swagger'), swagger.options)

  var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  //mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
   mongoDatabase = process.env.MONGODB_DATABASE || 'sampledb', 
   mongoPassword = process.env.MONGODB_PASSWORD, mongoUser = process.env.MONGODB_USER,
   mongoPort = process.env.MONGO_PORT || '27017',
  mongoHost = process.env.MONGO_CLUSTER_HOST || 'localhost',
  mongoURL = '';

  mongoURL = 'mongodb://'+mongoHost + ':' +  mongoPort + '/' + mongoDatabase;


    console.log('MongoURL '+mongoURL) 
    mongoose.connect(mongoURL,{ useNewUrlParser: true }) 
    .then(() => console.log('MongoDB connected…'))
    .catch(err => console.log(err))

  // Loop over each route
  routes.forEach((route, index) => {
    fastify.route(route)
  })
  
  // Run the server!
  const start = async () => {
    try {
      fastify.listen(port, ip, function (err, address) {
        if (err) {
          fastify.log.error(err)
          process.exit(1)
        }
        console.log(`server listening on ${address}`) 
        fastify.log.info(`server listening on ${address}`)
      })
     // await fastify.listen(3000)
      //fastify.swagger()
   
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()