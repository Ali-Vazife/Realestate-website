# RealEstate Website

Welcome to the RealEstate Website. Our project, built on a robust MVC architecture, utilizes **Node.js**, **Express**, **MongoDB**, and **Mongoose** for the backend, with Pug as the template engine.

## Project Demo
![GIF](https://github.com/Ali-Vazife/Realstate-website/blob/main/website.gif)

## More information:

- **User Authentication and Authorization:**

  - Users can securely sign up, log in, and log out using their phone numbers with OTP verification.
  - JWT tokens are employed for authentication, ensuring a secure and reliable user experience.

- **Security Best Practices:**

  - Our project prioritizes security with measures against brute force attacks, XSS attacks, DoS attacks, NoSQL query injection, and other industry best practices.
    
  - **bcryptjs**: Used for hashing passwords to securely store user credentials in the database. Hashing passwords is a critical security measure to prevent plain text passwords from being compromised.
  
  - **express-mongo-sanitize**: Prevents MongoDB Operator Injection by sanitizing user-supplied data, removing any MongoDB operators from input, which can help protect against NoSQL injection attacks.
  
  - **express-rate-limit**: Helps to limit repeated requests to public APIs and endpoints, providing protection against brute-force attacks by controlling the rate of incoming requests.
  
  - **helmet**: Enhances your app's security by setting various HTTP headers, such as `Content-Security-Policy`, `X-Frame-Options`, and `X-XSS-Protection`, to protect against well-known web vulnerabilities.
  
  - **hpp**: Protects against HTTP Parameter Pollution attacks by clearing the query string parameters of any duplicates, ensuring that only the last parameter value is used.
  
  - **jsonwebtoken**: Provides a secure way to transmit information between parties as a JSON object, ensuring the integrity and authenticity of the data with a signature.
  
  - **xss-clean**: Sanitizes user input to prevent cross-site scripting (XSS) attacks, which can exploit vulnerabilities by injecting malicious scripts into web pages viewed by other users.

- **User Profile Customization:**

  - Users have the freedom to customize their profiles by changing their names and profile pictures in the user panel.

- **Property Listing:**

  - Users can easily list their properties for rent or sale on the platform.
  - Admin approval is required for user-generated ads to maintain quality and trust.

- **Admin Panel:**

  - Admins have access to a powerful panel where they can add, delete, and manage property listings.
  - Verification of user-generated ads is handled in the admin panel.

- **Map Integration:**
  - Users can explore all listed properties on a map, providing a visual representation with geographical coordinates.

## Folder structure

```bash
├── controllers
│ ├── authController.js
│ ├── errorController.js
│ ├── handlerFactory.js
│ ├── rentController.js
│ ├── saleController.js
│ ├── userController.js
│ └── viewsController.js
├── models
│ ├── rentModel.js
│ ├── saleModel.js
│ └── userModel.js
├── public
│ ├── img
│ ├── js
│ └── style
├── routes
│ ├── rentRoutes.js
│ ├── saleRoutes.js
│ ├── userRoutes.js
│ └── viewRoutes.js
├── utils
│ ├── apiFeatures.js
│ ├── appError.js
│ ├── catchAsync.js
├── views
│ └── pug files...
├── app.js
├── config.env
├── package-lock.json
├── package.json
└── server.js
```

## Getting Started

1. **Installation:**
   - Clone the repository to your local machine.
   - Install dependencies using `npm install`.
   - Create a `config.env` file based on the provided `exampleconfig.env` file. Update the configuration parameters such as MongoDB connection details and other environment variables.
2. **Configuration:**

   - Set up your MongoDB connection.
   - Configure environment variables, ensuring security measures are in place.

3. **Run the Application:**
   - Start the server with `npm start`.
   - Visit `http://localhost:3000` to explore the RealEstate Website.
