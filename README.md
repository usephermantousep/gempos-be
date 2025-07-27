# GemPOS - Multi-Tenant Point of Sales System for UMKM

GemPOS adalah sistem Point of Sales (POS) multi-tenant yang dirancang khusus untuk UMKM (Usaha Mikro, Kecil, dan Menengah). Sistem ini memungkinkan beberapa bisnis untuk menggunakan platform yang sama dengan data yang terisolasi dan aman.

## ✨ Fitur Utama

### 🏢 Multi-Tenancy

- **Isolasi Data**: Setiap tenant memiliki data yang terpisah dan aman
- **Path-based Access**: Akses melalui URL path (contoh: /tenant/tokobudi/products)
- **Tenant Slug**: URL-friendly identifier untuk setiap tenant
- **User Validation**: Sistem memvalidasi user belongs to tenant di URL

### 🛒 Manajemen Produk

- Kategori produk yang fleksibel
- Stok inventory real-time
- Barcode scanning support
- Upload gambar produk
- Harga cost dan jual terpisah

### 💰 Sistem Transaksi

- Proses penjualan yang cepat dan mudah
- Multiple payment methods (Cash, Card, E-wallet, Bank Transfer)
- Print receipt otomatis
- Refund dan return management

### 👥 Manajemen Pengguna

- Role-based access control (Owner, Admin, Cashier, Staff)
- User management per tenant
- Authentication dengan JWT

### 📊 Reporting & Analytics

- Laporan penjualan harian, mingguan, bulanan
- Top selling products
- Sales performance analytics
- Inventory reports

### 🏪 Manajemen Toko

- Informasi bisnis lengkap
- Pengaturan pajak dan diskon
- Customer database
- Loyalty program support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Redis (optional, untuk caching)

### Installation

1. **Clone repository**

```bash
git clone https://github.com/your-username/gempos-be.git
cd gempos-be
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env file dengan konfigurasi database dan JWT secret
```

4. **Setup database**

```bash
# Buat database MySQL
mysql -u root -p
CREATE DATABASE `gempos-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Jalankan migrasi (otomatis dengan synchronize: true di development)
npm run start:dev
```

5. **Jalankan aplikasi**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Docker Deployment

1. **Menggunakan Docker Compose**

```bash
docker-compose up -d
```

Aplikasi akan berjalan di:

- API: http://localhost:3000
- Documentation: http://localhost:3000/api

## 📖 API Documentation

### Authentication Endpoints

```
POST /api/v1/auth/register - Register user baru
POST /api/v1/auth/login - Login user
```

### Tenant Management

```
GET /api/v1/tenants - List semua tenant
POST /api/v1/tenants - Buat tenant baru
GET /api/v1/tenants/:id - Detail tenant
GET /api/v1/tenants/slug/:slug - Get tenant by slug
PUT /api/v1/tenants/:id - Update tenant
DELETE /api/v1/tenants/:id - Hapus tenant
```

### Product Management (Path-based)

```
GET /api/v1/tenant/:tenantSlug/products - List produk
POST /api/v1/tenant/:tenantSlug/products - Tambah produk baru
GET /api/v1/tenant/:tenantSlug/products/:id - Detail produk
PUT /api/v1/tenant/:tenantSlug/products/:id - Update produk
DELETE /api/v1/tenant/:tenantSlug/products/:id - Hapus produk
```

### Transaction Management (Path-based)

```
GET /api/v1/tenant/:tenantSlug/transactions - List transaksi
POST /api/v1/tenant/:tenantSlug/transactions - Buat transaksi baru
GET /api/v1/tenant/:tenantSlug/transactions/:id - Detail transaksi
PUT /api/v1/tenant/:tenantSlug/transactions/:id - Update transaksi
POST /api/v1/tenant/:tenantSlug/transactions/:id/complete - Complete transaksi
POST /api/v1/tenant/:tenantSlug/transactions/:id/cancel - Cancel transaksi
```

### User Management (Path-based)

```
GET /api/v1/tenant/:tenantSlug/users - List users
POST /api/v1/tenant/:tenantSlug/users - Tambah user baru
GET /api/v1/tenant/:tenantSlug/users/:id - Detail user
PUT /api/v1/tenant/:tenantSlug/users/:id - Update user
DELETE /api/v1/tenant/:tenantSlug/users/:id - Hapus user
```

## 🏗️ Arsitektur

### Database Schema

```
tenants (multi-tenancy support)
├── users (per tenant)
├── products (per tenant)
├── categories (per tenant)
├── customers (per tenant)
├── transactions (per tenant)
└── transaction_items (per tenant)
```

### Technology Stack

- **Backend**: NestJS + TypeScript
- **Database**: MySQL + TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker + Docker Compose

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=rootpassword
DATABASE_NAME=gempos-db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development
TENANT_MODE=subdomain
```

### Multi-Tenant Configuration

```typescript
// Tenant identification sekarang menggunakan URL path:
// /api/v1/tenant/{slug}/...
//
// TenantGuard akan:
// 1. Mengambil slug dari URL parameter
// 2. Mencari tenant berdasarkan slug
// 3. Memvalidasi user belongs to tenant tersebut
// 4. Menambahkan tenant info ke request object
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

### Production Setup

1. Setup MySQL database
2. Configure environment variables
3. Build aplikasi: `npm run build`
4. Jalankan: `npm run start:prod`

### Docker Production

```bash
# Build image
docker build -t gempos-api .

# Run dengan docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@gempos.id
- Documentation: https://docs.gempos.id
- Issues: https://github.com/your-username/gempos-be/issues

## ⭐ Roadmap

### Phase 1 (Current)

- ✅ Multi-tenant architecture
- ✅ Basic POS functionality
- ✅ User management
- ✅ Product management
- ✅ Transaction processing

### Phase 2 (Next)

- 🔄 Advanced reporting
- 🔄 Inventory management
- 🔄 Customer loyalty program
- 🔄 Integration with payment gateways
- 🔄 Mobile app support

### Phase 3 (Future)

- 📱 WhatsApp integration
- 🛒 E-commerce integration
- 📊 Advanced analytics
- 🏪 Multiple store locations
- 🎯 Marketing tools

---

**Made with ❤️ for n UMKM**

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
