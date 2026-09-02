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

## Author

**Karol Kwapiński**
