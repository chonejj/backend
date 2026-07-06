import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

let lastUserId = 1;

interface User {
  id: number;
  name: string;
}

const users: User[] = [{
  id: 1,
  name: "qube"
}];

fastify.get("/users", (request, response) =>{
  response.send(users)
})

fastify.post<{ Body: User, Reply: User }>("/users", (request, response) => {
  const newUser = {
    id: ++lastUserId,
    name: request.body.name
  }
  users.push(newUser)

  response.send(newUser);
})

fastify.delete<{Params: {id: string }}>("/users/:id", (request, response) => {
  const userIndex = users.findIndex((user) => {
    return user.id === parseInt(request.params.id)
  })

  if (userIndex === -1) {
    response.status(404)
    response.send()
  } else {
    users.splice(userIndex, 1)
    response.send(users[userIndex])
  }
})


fastify.get<{Params: {id: string }}>("/users/:id", (request, response) => {
  const userIndex = users.findIndex((user) => {
    return user.id === parseInt(request.params.id)
  })
  if(userIndex === -1) {
    response.status(404);
    response.send();
  }
  else {
    response.send(users[userIndex])
  }
})


// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
  console.log(`Server is now listening on ${address}`)
})

