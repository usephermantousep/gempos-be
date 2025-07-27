# GemPOS API Usage Examples

This file contains examples of how to use the path-based multi-tenant GemPOS API.

## Authentication

### 1. Register a new user to a tenant
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@tokobudi.com",
  "password": "password123",
  "tenantSlug": "tokobudi"
}
```

### 2. Login user
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@tokobudi.com",
  "password": "password123",
  "tenantSlug": "tokobudi"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@tokobudi.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "staff",
    "tenantId": "tenant-uuid"
  }
}
```

## Tenant Management

### 1. Create a new tenant
```bash
POST /api/v1/tenants
Content-Type: application/json

{
  "name": "Toko Budi Electronics",
  "subdomain": "tokobudi", 
  "slug": "tokobudi",
  "businessName": "Toko Budi Electronics",
  "businessType": "Electronics",
  "businessAddress": "Jl. Merdeka No. 123, Jakarta",
  "businessPhone": "+6281234567890",
  "businessEmail": "info@tokobudi.com"
}
```

### 2. Get tenant by slug
```bash
GET /api/v1/tenants/slug/tokobudi
```

## Path-based API Usage (User must belong to tenant)

All the following APIs require:
1. JWT Authentication token in Authorization header
2. User must belong to the tenant specified in the URL path

### 1. Get all products for a tenant
```bash
GET /api/v1/tokobudi/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Create a product
```bash
POST /api/v1/tokobudi/products  
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "sku": "IP15-001",
  "barcode": "1234567890123",
  "price": 15000000,
  "cost": 12000000,
  "stock": 10,
  "minStock": 2,
  "unit": "pcs",
  "trackStock": true
}
```

### 3. Get all users in a tenant
```bash
GET /api/v1/tokobudi/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create a transaction
```bash
POST /api/v1/tokobudi/transactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "unitPrice": 15000000,
      "discount": 0
    }
  ],
  "paymentMethod": "cash",
  "paidAmount": 30000000,
  "tax": 0,
  "discount": 0
}
```

### 5. Complete a transaction
```bash
POST /api/v1/tokobudi/transactions/{transaction-id}/complete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Cancel a transaction
```bash
POST /api/v1/tokobudi/transactions/{transaction-id}/cancel
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Reports

### 1. Get sales report
```bash
GET /api/v1/tokobudi/reports/sales?period=monthly
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Custom date range
GET /api/v1/tokobudi/reports/sales?period=custom&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Get inventory report
```bash
GET /api/v1/tokobudi/reports/inventory
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Filter by stock levels
GET /api/v1/tokobudi/reports/inventory?minStock=0&maxStock=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Get dashboard metrics
```bash
GET /api/v1/tokobudi/reports/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ9...

Response:
{
  "today": {
    "revenue": 500000,
    "transactions": 12
  },
  "month": {
    "revenue": 15000000,
    "transactions": 450
  },
  "inventory": {
    "lowStock": 5,
    "outOfStock": 2
  }
}
```

## Report Response Examples

### Sales Report Response
```json
{
  "period": "2024-01-01 to 2024-01-31",
  "totalSales": 15000000,
  "totalTransactions": 450,
  "totalItems": 1200,
  "averageOrderValue": 33333.33,
  "topProducts": [
    {
      "productId": "uuid-1",
      "productName": "iPhone 15",
      "quantitySold": 25,
      "totalRevenue": 3750000
    }
  ],
  "salesByDay": [
    {
      "date": "2024-01-01",
      "sales": 500000,
      "transactions": 15
    }
  ],
  "paymentMethods": [
    {
      "method": "cash",
      "count": 200,
      "total": 8000000
    },
    {
      "method": "card", 
      "count": 150,
      "total": 5000000
    }
  ]
}
```

### Inventory Report Response
```json
{
  "totalProducts": 150,
  "lowStockProducts": [
    {
      "id": "uuid-1",
      "name": "iPhone 15",
      "currentStock": 2,
      "minStock": 5,
      "sku": "IP15-001"
    }
  ],
  "outOfStockProducts": [
    {
      "id": "uuid-2", 
      "name": "Samsung Galaxy S24",
      "sku": "SG24-001"
    }
  ],
  "inventoryValue": 500000000,
  "stockMovement": [
    {
      "productId": "uuid-1",
      "productName": "iPhone 15",
      "stockIn": 0,
      "stockOut": 3,
      "currentStock": 2
    }
  ]
}
```

## Security Features

### Tenant Validation
The `TenantGuard` ensures that:
1. The `tenantSlug` in the URL path corresponds to a valid tenant
2. The authenticated user belongs to that specific tenant
3. Users cannot access data from other tenants

### Example: Access Denied
If user from `tokobudi` tries to access `tokoani` data:

```bash
GET /api/v1/tokoani/products  
Authorization: Bearer [tokobudi-user-token]

Response: 403 Forbidden
{
  "statusCode": 403,
  "message": "User does not belong to this tenant"
}
```

## Error Responses

### 404 - Tenant Not Found
```json
{
  "statusCode": 404,
  "message": "Tenant not found"
}
```

### 403 - Access Denied  
```json
{
  "statusCode": 403,
  "message": "User does not belong to this tenant"
}
```

### 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Complete Workflow Example

1. **Create Tenant**
   ```bash
   curl -X POST http://localhost:3000/api/v1/tenants \
     -H "Content-Type: application/json" \
     -d '{"name":"Toko Budi","subdomain":"tokobudi","slug":"tokobudi","businessName":"Toko Budi Electronics"}'
   ```

2. **Register User to Tenant**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"firstName":"John","lastName":"Doe","email":"john@tokobudi.com","password":"password123","tenantSlug":"tokobudi"}'
   ```

3. **Login and Get Token**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@tokobudi.com","password":"password123","tenantSlug":"tokobudi"}'
   ```

4. **Access Tenant-specific Resources**
   ```bash
   curl -X GET http://localhost:3000/api/v1/tokobudi/products \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

This path-based multi-tenancy ensures complete data isolation and security between different businesses using the same GemPOS system.
