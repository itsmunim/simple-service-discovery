## A Service Discovery POC in Microservice Architecture

### Run necessary Services (In different shells)

- This has to be run first: `npm run proxy`, this is what takes care of service discovery and necessary redirection.

- `npm run checkout`; a dummy checkout service

- `npm run payment`; a dummy payment service

- Finally run the orchestration simulation by `npm run simulation`

### APIs

You can also explore the APIs by yourself. 

- [proxy](./proxy/ReadMe.md)
- [checkout](./checkout/ReadMe.md)
- [payment](./payment/ReadMe.md)

Checkout the services from the proxy urls as well, which are given in these docs as well.