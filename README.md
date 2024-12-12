# Smart-Energy-Meter-Integrating-with-bill-Generation-

# Smart Energy Meter

## Overview

The **Smart Energy Meter** is an innovative IoT-based system designed for real-time energy monitoring and efficient billing. Integrated with cloud services and a React.js-based user interface, this solution offers features like energy consumption tracking, automated billing, SMS/email notifications, PDF generation, and a customizable UI theme.

---

## Features

- **Real-Time Monitoring**: Displays voltage, current, power, and timestamps of readings.
- **Dynamic Billing**: Automatically calculates energy consumption and live billing.
- **Notification Support**: Send bills via SMS and email.
- **PDF Generation**: Generate and download electricity bills as PDFs.
- **Theme Customization**: Switch between light and dark modes for better accessibility.
- **Backend Integration**: Efficiently handles data storage and API requests using SQLite and Express.js.

---

## Installation Guide

Follow these steps to set up and run the Smart Energy Meter system:

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **SQLite3**
- **React.js**
- **Twilio Account** (for SMS functionality)
- **Gmail App Password** (for email functionality)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-repo>/smart-energy-meter.git
   cd smart-energy-meter/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create and configure the SQLite database:

   ```bash
   touch sensor_data.db
   ```

   The database schema is automatically created during server startup.

4. Configure environment variables:

   - Open the `server.js` file.
   - Replace placeholders with your Twilio Account SID, Auth Token, and Gmail credentials:

     ```javascript
     const accountSid = '<Your-Twilio-SID>';
     const authToken = '<Your-Twilio-Auth-Token>';
     const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
             user: '<Your-Gmail>',
             pass: '<Your-App-Specific-Password>'
         }
     });
     ```

5. Start the backend server:

   ```bash
   node server.js
   ```

   The server runs on `http://localhost:3000`.

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The React app runs on `http://localhost:3001`.

---

## API Endpoints

### Sensor Data Endpoint

- **POST** `/data`
  - Stores voltage, current, and power data in the database.
  - **Request Body**:
    ```json
    {
        "voltage": 230,
        "current": 5,
        "power": 1150
    }
    ```

### Latest Reading Endpoint

- **GET** `/latest-reading`
  - Fetches the most recent sensor data.

### Bill Calculation Endpoint

- **GET** `/calculate-bill`
  - Calculates total energy consumption and bill amount.
  - **Query Parameters**:
    - `start`: Start timestamp.
    - `end`: End timestamp.

### Notification Endpoints

- **POST** `/send-bill`
  - Sends the bill via SMS.
  - **Request Body**:
    ```json
    {
        "totalEnergy": 10,
        "totalBill": 50
    }
    ```

- **POST** `/send-email`
  - Emails the bill to the user.
  - **Request Body**:
    ```json
    {
        "customerDetails": {
            "name": "John Doe",
            "email": "johndoe@example.com"
        },
        "billingData": {
            "totalEnergy": 10,
            "totalBill": 50
        }
    }
    ```

---

## Usage Instructions

1. Open your browser and navigate to `http://localhost:3001`.
2. Monitor live energy readings and billing information.
3. Use available options to download the bill as a PDF, send via SMS, or email.
4. Customize the interface by toggling between light and dark modes.

---

## Future Enhancements

- Predictive analytics for energy consumption.
- Mobile application integration.
- Multi-language support.
- Enhanced security for user data.

---

## Contributing

We welcome contributions! Fork the repository and submit pull requests to suggest improvements.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

Thank you for exploring the Smart Energy Meter project!

