// Require the fastify framework and instantiate it
const fastify = require('fastify')({
    logger: true
  })
  
  // Require external modules
  const mongoose = require('mongoose')
  
  // Import Routes
  const routes = require('./routes')
  
  // Import Swagger Options
  const swagger = require('./config/swagger')
  
  // Register Swagger
  fastify.register(require('fastify-swagger'), swagger.options)
  
  // Connect to DB
  //provide a sensible default for local development
  const db_name = "sampledb";
  const mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
  //take advantage of openshift env vars when available:
  if(process.env.OPENSHIFT_MONGODB_DB_URL){
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
  }  
  mongoose.connect(mongodb_connection_string)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))
  
  // Loop over each route
  routes.forEach((route, index) => {
    fastify.route(route)
  })
  
  // Run the server!
  const start = async () => {
    try {
      var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
      var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
      fastify.listen(3000, server_ip_address, function (err, address) {
        if (err) {
          fastify.log.error(err)
          process.exit(1)
        }
        fastify.log.info(`server listening on ${address}`)
      })
     // await fastify.listen(3000)
      fastify.swagger()
   
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()