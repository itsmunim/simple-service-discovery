## Payment Service

A barebone payment service. Just to demonstrate.

### API

- Url: `http://localhost:8081/`

- Url from Proxy: `http://localhost:9020/p/payment-service/`


`POST` `/api/payment/pay`

- Accepts specific format of cart state emited by checkout service.

- Request:
  
  ```
  {'id@1': {id: 'id@1', name: 'item-1', price: 123}}
  ```