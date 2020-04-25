## Checkout Service

A simple checkout cart. It has only one instance of it. 
Make sure `proxy-service` is up and running already.

### API

- Url: `http://localhost:8080/`

- Url from Proxy: `http://localhost:9020/p/checkout-service/`

`GET` `/api/checkout/cart`

- Returns current cart state.


`POST` `/api/checkout/cart`

- Adds an item to cart. If item with same id existed, increments the count.

- Request:
  
  ```
  {id: 'p-1', name: 'product-1', price: 21}
  ```

`POST` `/api/checkout/cart/remove`

- Removes an item from cart.

- Request:

  ```
  {id: 'p-1'}
  ```