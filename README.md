#  Setu (सेतु) · Social Impact Donation & Logistics Network

<div align="center">

![Setu Banner](frontend/public/logo.png)

**Bridging the gap between surplus giving, volunteer transport, and care center need.**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20Spring%20Security-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![WebSocket](https://img.shields.io/badge/Realtime-STOMP%20WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://spring.io/)

</div>

---

## 📖 About The Project

In India, millions of tonnes of edible food, surplus clothing, educational books, and medical aid go to waste daily, while thousands of registered orphanages and shelters struggle for basic supplies. The primary bottleneck is **last-mile logistics and trust**.

**Setu (सेतु — *The Bridge*)** is a transparent, real-time 3-way platform connecting:
1. **Donors** who have surplus goods to give.
2. **Volunteer Drivers** traveling routine commute routes willing to carry packages.
3. **Verified Orphanages & Care Centers** who receive essential resources directly.

---

## ✨ Key Features

### 🤲 1. For Donors (Giving)
- **1-Tap Smart Geolocation**: Instantly detect GPS coordinates and auto-fill locality for fast pickup scheduling.
- **Urgency & Expiry Timers**: Mark cooked meals or perishable goods with live countdown timers.
- **Categorized Listings**: Post Food, Clothes, Books, Medicine, or Other essentials.
- **Live Status Tracking**: Watch your donation transition from `AVAILABLE` ➔ `ASSIGNED` ➔ `PICKED_UP` ➔ `DELIVERED`.

### 🚚 2. For Volunteer Drivers (Carrying)
- **Route-Matched Pickup Browser**: Find open donation pickups nearby and along your commute routes.
- **1-Tap Delivery Claiming**: Claim trips and lock delivery tasks.
- **Step-by-Step Milestones**: Update delivery status with confirmation timestamps.
- **Community Trust Badges**: Earn recognition badges for successful deliveries and speed milestones.

### 🏠 3. For Orphanages & Care Centers (Receiving)
- **Live Inventory Marketplace**: Browse verified available donations in real-time.
- **Custom Resource Requests**: Post urgent needs for specific items (e.g., school stationery, baby food, winter wear).
- **Incoming Shipment Dashboard**: Real-time notifications and ETA as the volunteer approaches.

### 🔐 4. Enterprise Authentication & Security
- **Dual Login Support (Email OR Mobile Number)**: Spotify-style tab toggle allowing login with registered Email or Indian Mobile Number (`+91` 10 digits).
- **OTP-Based Email Verification**: 6-digit OTP verification on registration and password resets.
- **All-India Structured Location**: Comprehensive dataset covering **all 28 States and 8 Union Territories** with dynamic district selectors.
- **Role-Based Access Control (RBAC)**: Strict JWT tokens with route guards for `DONOR`, `VOLUNTEER`, and `ORPHANAGE`.

### 📊 5. Real-Time Impact Analytics
- **Live Analytics Chart**: Visual breakdown of total donations by category, delivery completion rates, and monthly impact curve.
- **Setu Impact Champions Leaderboard**: Public leaderboard recognizing top community donors and volunteer drivers.
- **WebSocket STOMP Integration**: Instant live broadcast updates across the network.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Vanilla CSS3 Design System, WebSockets (StompJS / SockJS) |
| **Backend** | Java 17, Spring Boot 3.x, Spring Security 6, Spring Data JPA, Spring WebSocket |
| **Authentication** | JSON Web Tokens (JWT), BCrypt Password Hashing, JavaMailSender OTP |
| **Database** | MySQL 8.x / H2 Database |
| **Design & UI** | Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*), Glassmorphism, Dark Emerald Theme |

---

## 🚀 Getting Started

### Prerequisites
- **Java JDK 17+**
- **Node.js 18+** & **npm**
- **MySQL Server** (or use in-memory H2)

---

### 1. Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Surendar15/SETU.git
   cd SETU/backend
   ```

2. **Configure Database & Mail (`src/main/resources/application.properties`):**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/donation_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.jpa.hibernate.ddl-auto=update

   # JWT Secret Key
   jwt.secret=9a6747f3a778ac7da31957b26581fcd25b2f0b9a6747f3a778ac7da31957b26581fcd25b

   # Email OTP Configuration (Gmail SMTP)
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_gmail_app_password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```

3. **Run the Spring Boot server:**
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Linux / macOS
   ./mvnw spring-boot:run
   ```
   *Backend runs on `http://localhost:8080`.*

---

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
   *Frontend application will be live at `http://localhost:5173`.*

---

## 📡 REST API Overview

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register Donor, Volunteer, or Orphanage |
| `POST` | `/api/auth/login` | Authenticate with Email/Phone + Password |
| `POST` | `/api/auth/send-otp` | Send 6-digit OTP verification code |
| `POST` | `/api/auth/verify-otp` | Verify OTP code |
| `POST` | `/api/auth/reset-password`| Reset forgotten password via OTP |

### 📦 Donations (`/api/donations`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/donations` | Post a new donation with location details |
| `GET` | `/api/donations/my` | Get current user's posted donations |
| `GET` | `/api/donations/available` | Browse active available donations |
| `GET` | `/api/donations/{id}` | Get donation details and status |

### 🚚 Deliveries (`/api/deliveries`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/deliveries/open` | List unclaimed deliveries |
| `POST` | `/api/deliveries/{id}/claim` | Volunteer claims a pickup |
| `PATCH`| `/api/deliveries/{id}/status`| Update delivery milestone status |

### 📊 Platform Analytics (`/api/stats`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats/impact` | Aggregate network metrics & category stats |
| `GET` | `/api/stats/leaderboard` | Top donors and volunteer heroes |

---

## 📁 Project Directory Structure

```text
SETU/
├── backend/
│   ├── src/main/java/com/donation/
│   │   ├── config/          # Security, JWT, CORS, WebSockets
│   │   ├── controller/      # REST API Controllers
│   │   ├── dto/             # Request / Response DTOs
│   │   ├── model/           # JPA Entities (User, Donation, Delivery, etc.)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # CustomUserDetails & JWT Filter
│   │   └── service/         # Business Logic & OTP Services
│   └── src/main/resources/  # application.properties
│
├── frontend/
│   ├── public/              # Logo, Favicon, Demo Assets
│   ├── src/
│   │   ├── api/             # Axios API Clients (Auth, Donations, Stats, OTP)
│   │   ├── components/      # Reusable Components (TopNav, Footer, LiveDemoPlayer, Charts)
│   │   ├── context/         # AuthContext & NotificationContext
│   │   ├── data/            # India 28 States & 8 UTs Dataset
│   │   ├── pages/           # Landing, Auth (Login, Register), Role Dashboards
│   │   └── styles/          # theme.css (Design System Tokens)
│   └── package.json
│
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <b>Built with ❤️ for social good by the Setu Team.</b>
</div>
