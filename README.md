# PlayQuest

A web-based online store for **PC and console games** developed as a university project.

The application allows users to browse and compare games, filter products by categories and platforms, manage their shopping cart, place orders, make payments, and manage their profiles and addresses. The system also provides personalized game recommendations and purchase statistics.

## Features

### User functionality

* User registration and authentication
* JWT-based authentication
* Browsing PC and console games
* Filtering games by categories and platforms
* Game comparison
* Game recommendations
* Shopping cart management
* Checkout and order placement
* Online payments
* Payment status management
* Order history and order details
* User profile and address management
* Purchase statistics
* Pagination
* Input validation
* Responsive design
* Multi-language support

### Administrator functionality

* Managing games
* Managing users
* Managing categories and platforms
* Managing orders
* Administrative statistics
* Soft deletion of selected entities

## Technologies

* **Java**
* **Spring Boot**
* **React**
* **JavaScript**
* **PostgreSQL**

## Authentication & Security

The application uses **JWT-based authentication** to secure user accounts and application resources.

Different user roles are supported, allowing access to administrative functionality based on assigned permissions.

The application also includes input validation and secure handling of authenticated requests.

## Architecture

The backend follows a layered architecture with separate components responsible for:

* Controllers
* Services
* Repositories
* Entities
* Security
* Configuration

The frontend was implemented using **React** and communicates with the backend application through the API.

## Additional Features

The application includes several features designed to improve the shopping experience:

* **Game comparer** – allows users to compare selected games
* **Game recommendations** – suggests games to users
* **Filtering and pagination** – improves browsing and reduces the amount of data loaded at once
* **Purchase statistics** – provides information about completed purchases
* **Payment management** – supports payment processing and tracking of unpaid orders
* **Internationalization** – supports multiple language versions of the application
* **Responsive design** – adapts the interface to different screen sizes

## Running the Application

### Prerequisites

Before running the application, make sure the following are installed:

* **Java 17**
* **Node.js and npm**
* **PostgreSQL**
* **Git**

### Backend

1. Clone the repository:

```bash
git clone https://github.com/karol-kwapinski/PlayQuest.git
cd PlayQuest
```

2. Configure the PostgreSQL database in the application configuration.

3. Build and run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows, use:

```bash
mvnw.cmd spring-boot:run
```

### Frontend

Navigate to the frontend directory and install the dependencies:

```bash
npm install
```

Then start the development server:

```bash
npm start
```

The application should now be available locally in your browser.

### Database

The application uses **PostgreSQL** as its database.

Create a PostgreSQL database named `PlayQuest4` and configure the database connection in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/playquest
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> The exact database configuration may need to be adjusted depending on the local environment.


## Author

**Karol Kwapiński**
