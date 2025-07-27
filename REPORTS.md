# GemPOS Reports Module

The reports module provides comprehensive business intelligence and analytics for the multi-tenant POS system.

## Features

### 1. Sales Reports
- **Daily, Weekly, Monthly, Yearly** periods
- **Custom date ranges**
- **Top products** by revenue and quantity
- **Sales trends** by day
- **Payment method** analysis
- Filter by product or category

### 2. Inventory Reports
- **Low stock alerts** (products below minimum stock)
- **Out of stock** product listing
- **Inventory valuation** (total value of stock)
- **Stock movements** tracking
- Filter by stock levels

### 3. Dashboard Metrics
- **Today's performance** (revenue, transactions)
- **Monthly performance** overview
- **Inventory status** (low stock, out of stock counts)
- Real-time KPI monitoring

## API Endpoints

### Sales Report
```
GET /api/v1/{tenantSlug}/reports/sales
Query Parameters:
- period: daily|weekly|monthly|yearly|custom
- startDate: YYYY-MM-DD (required for custom)
- endDate: YYYY-MM-DD (required for custom)
- productId: UUID (optional filter)
- categoryId: UUID (optional filter)
```

### Inventory Report
```
GET /api/v1/{tenantSlug}/reports/inventory
Query Parameters:
- minStock: number (optional)
- maxStock: number (optional)
```

### Dashboard Metrics
```
GET /api/v1/{tenantSlug}/reports/dashboard
No parameters required
```

## Security
- All endpoints require JWT authentication
- TenantGuard ensures data isolation between tenants
- Users can only access reports for their own tenant

## Data Sources
- **Transactions**: Completed transactions only
- **Products**: Active products with stock tracking
- **Real-time**: Data updated on each request

## Use Cases
1. **Business Performance**: Track daily/monthly sales trends
2. **Inventory Management**: Monitor stock levels and identify reorder needs
3. **Product Analysis**: Identify best-selling products
4. **Financial Planning**: Analyze revenue patterns and payment preferences
5. **Operational Efficiency**: Dashboard overview for quick decision making

## Future Enhancements
- Scheduled report generation
- Export to PDF/Excel
- Advanced filtering and grouping
- Predictive analytics
- Customer behavior analysis
