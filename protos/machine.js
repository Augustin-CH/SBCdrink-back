var PROTO_PATH = __dirname + '/machine.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var machine = grpc.loadPackageDefinition(packageDefinition).machine;
var client = new machine.Machine(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

async function runMakeCocktail(request) {
  return await new Promise((resolve, reject) => {
    client.makeCocktail({
      steps: JSON.stringify(request)
    }, function(err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}



exports.runMakeCocktail = runMakeCocktail;