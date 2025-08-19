# 🛒 Orders & Cart Service

## 📌 Overview
This service implements an **e-commerce checkout flow** with support for:
- Product catalog  
- Shopping cart  
- Order creation with stock validation  
- Transactional consistency using Sequelize  
- Role-based user access  
- Unit tests for core logic & handlers  

### 🔧 Tech Choices
- **Backend Framework**: [NestJS](https://nestjs.com/) (modular + testable)  
- **Database ORM**: [Sequelize](https://sequelize.org/) with MariaDB/Postgres (transaction support)  
- **Containerization**: Docker & Docker Compose for local development  
- **Testing**: Jest for unit tests  
- **API Docs**: Swagger (via `@nestjs/swagger`)  

## 🚀 Running Locally with Docker Compose

1. Clone the repository:
2. docker-compose up --build

## seeding steps
3. seed from docker: docker exec -it nest_app npm run seed


## ENV Variables
POSTGRES_USER=nestuser
POSTGRES_PASSWORD=nestpass
POSTGRES_DB=nestdb
POSTGRES_HOST=postgres 
POSTGRES_PORT=5432
NODE_ENV=development
PORT=3000
TAX_RATE=0.1
JWT_SECRET=mysupersecret
JWT_EXPIRES_IN=30d

## Running tests
npm run test

## 🌍 Deployed URL

👉 [https://marketplace-client-drab.vercel.app](https://marketplace-client-drab.vercel.app)

---

## 📖 API Docs
- Local Swagger UI: http://localhost:3000/api-docs
- Deployed docs: https://marketplace-service-xrzo.onrender.com/api-docs

## ⚠️ Known Trade-Offs & Future Improvements

### Current Limitations
- Payments not integrated (orders only placed).  
- No guest checkout (user registration required).  
- No UI for admin actions

### Future Improvements
- Payment integration (Stripe / Open Banking).  
- Audit logs for compliance.  
- Redis caching for product reads.  
- End-to-end + integration tests.  
- Order status lifecycle (PLACED → SHIPPED → DELIVERED).  