# Behance

## Introduction

Welcome to the Behance project! This project aims to create a modern and stylish platform where users can browse, search, and sort various designs. The application features a landing page where all designs are listed in a visually appealing manner, providing an excellent user experience. Key features include a functional navigation bar, a search bar for finding specific designs, and a sorting option to organize designs based on different criteria.

## Frontend Features

- **Landing Page**: Displays all designs in a modern layout.
- **Navigation Bar**: Assists users in navigating through the application.
- **Search Bar**: Allows users to search for specific designs.
- **Sorting Option**: Provides the ability to sort designs based on various attributes.
- **Modal for Viewing Images**: Enhances the user experience by displaying images in a modal.
- **Like Feature**: Allows users to like their favorite designs.

## Frontend Folder Structure

The project's folder structure is organized as follows:

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── Content/
│   │   ├── Footer/
│   │   ├── Navbar/
│   │   └── SearchBar/
│   ├── context/
│   ├── data/
│   ├── helpers/
│   ├── pages/
│   │   └── HomePage.jsx
│   ├── styles/
│   │   ├── App.css
│   │   ├── index.css
│   ├── App.jsx
│   ├── data.js
│   ├── main.jsx
├── .env
```

### File Preview

- **frontend**: The root directory of the frontend part of the application.
- **src**: The source directory where all the main code resides.
  - **assets**: Contains static assets like images, icons, etc.
  - **components**: Houses all the reusable components.
    - **common**: Contains common components that are used across the application.
    - **Content**: Contains components related to displaying the main content.
    - **Footer**: The footer component of the application.
    - **Navbar**: The navigation bar component.
    - **SearchBar**: The search bar component.
  - **context**: Contains context providers and consumers for state management.
  - **data**: Stores data-related files.
  - **helpers**: Contains utility/helper functions.
  - **pages**: Contains the different page components of the application.
    - **HomePage.jsx**: The main landing page of the application.
  - **styles**: Contains all the CSS files for styling the application.
    - **App.css**: Styles specific to the App component.
    - **index.css**: Global styles for the application.
  - **App.jsx**: The main App component.
  - **data.js**: Contains data used in the application.
  - **main.jsx**: The entry point of the React application.
- **.env**: Environment variables file.

---


## Backend Features

- **User Authentication**: Secure authentication using access tokens and refresh tokens.
- **Data Provisioning**: Provides data to the frontend.
- **Like Feature**: Allows users to like images.
- **APIs Built from Scratch**: Professional code and best practices used throughout the API development.

## Backend Folder Structure

The project's folder structure is organized as follows:

```
src/
├── controllers/
├── data/
│   └── card.js
├── database/
│   └── index.ts
├── middleware/
│   └── authMiddleware.ts
├── models/
│   ├── cardModel.ts
│   └── userModel.ts
├── routes/
│   ├── authRoutes.ts
│   └── cardRoutes.ts
├── utils/
│   ├── token.ts
│   ├── config.ts
│   └── index.ts
```

### Explanation

- **src**: The source directory where all the main code resides.
  - **controllers**: Contains the logic for handling requests and sending responses.
  - **data**: Contains data-related files.
    - **card.js**: Manages data related to cards (designs).
  - **database**: Contains database connection and configuration files.
    - **index.ts**: Sets up and exports the database connection.
  - **middleware**: Contains middleware functions for request processing.
    - **authMiddleware.ts**: Middleware for handling authentication.
  - **models**: Defines the data models used in the application.
    - **cardModel.ts**: Schema and model for card (design) data.
    - **userModel.ts**: Schema and model for user data.
  - **routes**: Contains route definitions for the API endpoints.
    - **authRoutes.ts**: Routes for authentication-related operations.
    - **cardRoutes.ts**: Routes for card (design) related operations.
  - **utils**: Contains utility functions and configurations.
    - **token.ts**: Functions for generating and verifying tokens.
    - **config.ts**: Configuration settings for the application.
    - **index.ts**: Miscellaneous utility functions.


## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- npm
- MongoDB
- CORS
- JWT

### Installation

1. Clone the repo

```sh
git clone https://github.com/your_username/behance.git
```

2. Install NPM packages

```sh
npm install
```

3. Start the development server

```sh
npm start
```

## Usage

Navigate to the landing page to browse all designs. Use the navbar to explore different sections of the application. Utilize the search bar to find specific designs and use the sorting option to organize the displayed designs as per your preference.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Name - [Arin Paliwal](https://arinpaliwal.vercel.app/)

Project Link: [https://github.com/arin-paliwal/Simplr_Behance_Clone](https://github.com/arin-paliwal/Simplr_Behance_Clone)

---
