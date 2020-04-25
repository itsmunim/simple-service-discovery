## Proxy Service

Basically an implementation of service discovery in microservices architecture.

### API

`/api/services/register`

- Registers a service.

- Request:
  
  ```
  {service: 'service-a', port: 2020}
  ```

`/api/services/deregister`

- De-registers a service.

- Request:

  ```
  {service: 'service-a', port: 2020}
  ```

`/p/{service-name}/api/`

- Does proxy to `/api` of `service-name` if it was registered.