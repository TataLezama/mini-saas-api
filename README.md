# Mini Saas Backend

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

## Documentación

### API

#### Usuarios

##### Registro

```bash
POST /api/auth/register
```

##### Login

```bash
POST /api/auth/login
```

##### Cambio de contraseña

```bash
POST /api/auth/change-password/:token
```

##### Validación de email

```bash
GET /api/auth/validate-email/:token
```

#### Compañias

##### Creación

```bash
POST /api/companies
```

##### Actualización

```bash
PUT /api/companies/:id
```

##### Activación

```bash
POST /api/companies/:id/activate
```

#### Productos

##### Creación

```bash
POST /api/products
```

##### Actualización

```bash
PUT /api/products/:id
```

#### Horarios

##### Creación

```bash
POST /api/schedules
```

##### Actualización

```bash
PUT /api/schedules/:id
```

#### Citas

##### Creación

```bash
POST /api/appointments
```

##### Actualización

```bash
PUT /api/appointments/:id
```

### Endpoints

| Endpoint | Descripción |
| --- | --- |
| /api/auth/register | Registro de usuario |
| /api/auth/login | Login de usuario |
| /api/auth/change-password/:token | Cambio de contraseña |
| /api/auth/validate-email/:token | Validación de email |
| /api/companies | Lista de companias |
| /api/companies/:id | Detalle de una compania |
| /api/companies/:id/activate | Activación de una compania |
| /api/products | Lista de productos |
| /api/products/:id | Detalle de un producto |
| /api/schedules | Lista de horarios |
| /api/schedules/:id | Detalle de un horario |
| /api/appointments | Lista de citas |
| /api/appointments/:id | Detalle de una cita |

### Licencia

MIT License

Copyright (c) 2021 Tatalezama

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.