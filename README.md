# dlah_resto

## Delilah Restó por A. de los Rios

REST API Operaciones CRUD, permite realizar altas, bajas y modificaciones para un sistema de pedidos online.

## Instalación

1. Crear directorio para correr los archivos "dlah_resto".
2. Correr package json para instalar a través de la terminal.

```bash
npm install
```
3. En el archivo .env ubicar las variables personales puerto, signature JWT Tokens y conexión a base de datos mysql phpMyAdmin XAMPP.

```bash

PORT = 3000
JWT_KEY = dlrkey

DRIVER_NAME = mysql
DB_USER = antonidlr
DB_PASSWORD = 
DB_HOST = 192.168.64.2
DB_PORT = 3306
DB_NAME = dbdelilah
```
4. Correr sentencias sql del archivo create.sql en el directorio /api/database en mysql phpMyAdmin, para crear las tablas asociadas.

5. Crear usuario inicial manualmente en mysql phpMyAdmin con role administrador (role = 1).
Example:

```bash
INSERT INTO users (id, username, fullname, email, phone, address, password, role)
    VALUES (1, 'admin', 'Antonio de los Rios', 'antoniodelosrios22@gmail.com', '1338048656', 'Cabildo 1500, Capital', 'admin', 1);
```

6. Correr sentencia y comprobar conexión con el servidor y base de datos.
```bash
npm start
```

## Uso de Endpoints

Para las pruebas locales de endpoints se usó POSTMAN.

## DOC de API spec.yml

Verificar la documentación en el archivo spec.yml para ver los detalles de los endpoints y esquemas de request y response de la API. Swagger: "2.0"

```bash
swagger: "2.0"
info:
  title: Delilah Resto API
  description: REST API Operaciones CRUD, permite realizar altas, bajas y modificaciones para un sistema de pedidos online.
  version: 1.0.0
```