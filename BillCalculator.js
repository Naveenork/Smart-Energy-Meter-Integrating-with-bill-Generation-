
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillCalculator.css'; // Import the updated CSS file
import jsPDF from 'jspdf';

function BillCalculator() {
    const [latestReading, setLatestReading] = useState({
        voltage: 0,
        current: 0,
        power: 0,
        timestamp: '',
    });
    const [totalEnergy, setTotalEnergy] = useState(0); // Live energy consumption
    const [totalBill, setTotalBill] = useState(0); // Live bill amount
    const [darkMode, setDarkMode] = useState(false); // Theme state

    // Fetch latest reading every 5 seconds
    const fetchLatestReading = async () => {
        try {
            const response = await axios.get('http://localhost:3000/latest-reading');
            setLatestReading(response.data);
        } catch (error) {
            console.error('Error fetching latest reading:', error);
        }
    };

    // Fetch live units and bill amount every 5 seconds
    const fetchBillData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/live-bill');
            setTotalEnergy(response.data.totalEnergy);
            setTotalBill(response.data.totalBill);
        } catch (error) {
            console.error('Error fetching live bill data:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchLatestReading();
            fetchBillData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Send SMS functionality
    const sendSMS = async () => {
        try {
            await axios.post('http://localhost:3000/send-bill', {
                totalEnergy,
                totalBill,
            });
            alert('Bill sent successfully via SMS!');
        } catch (error) {
            alert('Failed to send the bill via SMS. Please try again.');
        }
    };

    // PDF generation function
    const generatePDFBase64 = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const blueColor = [0, 51, 102];

        // Generate a dynamic bill number starting with 71172101
        const billNumber = `711721${Math.floor(Math.random() * 1000) + 1}`;

        // Set Header
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...blueColor);
        doc.text('Smart Energy Meter Bill', pageWidth / 2, 20, { align: 'center' });

        // Customer Information Section
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black text color for information
        doc.text(`Customer Name: Naveenkumar`, 10, 30);
        doc.text(`Mobile Number: 12345611558`, 10, 40);
        doc.text(`Address: No 24, Marutham Nagar, Sathy Main Road,`, 10, 50);
        doc.text(`Kalapatti Pirivu, Coimbatore, Tamil Nadu - 641035`, 10, 60);
        doc.text(`Smart Meter ID: 40340727`, 10, 70);
        doc.text(`Bill Number: ${billNumber}`, 10, 80);

        // Table Header
        doc.setTextColor(...blueColor);
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'bold');
        doc.text('Billing Summary', 10, 95);
        doc.setLineWidth(0.5);
        doc.setDrawColor(...blueColor);
        doc.line(10, 98, pageWidth - 10, 98); // Blue line separator

        // Table Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        const tableStartY = 105;

        const tableData = [
            ['Description', 'Details'],
            ['Total Energy Consumed', `${totalEnergy} kWh`],
            ['Live Bill Amount', `₹${totalBill}`],
        ];

        tableData.forEach((row, index) => {
            const rowY = tableStartY + index * 10;
            doc.text(row[0], 10, rowY); // First column: Description
            doc.text(row[1], pageWidth - 70, rowY); // Second column: Details
        });

        // Footer
        doc.setTextColor(...blueColor);
        doc.setFontSize(10);
        doc.text('Thank you for using Smart Energy Meter!', 10, tableStartY + 70);
        doc.text('Please pay by the due date to avoid penalties.', 10, tableStartY + 80);

        // Save the PDF
        doc.save('Electricity_Bill.pdf');
    };

    // Email sending functionality
    const emailBill = async () => {
        try {
            const customerDetails = {
                name: 'Naveenkumar',
                email: 'naveenkumarork@gmail.com',
            };

            const billingData = {
                totalEnergy,
                totalBill,
            };

            await axios.post('http://localhost:3000/send-email', {
                customerDetails,
                billingData,
            });

            alert('Bill emailed successfully!');
        } catch (error) {
            alert('Failed to send the bill via email. Please try again.');
            console.error('Email sending error:', error);
        }
    };

    return (
        <div className={darkMode ? 'container dark' : 'container light'}>
            <h1>Smart Energy Meter</h1>
            <label className="theme-switch">
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
                <span className="theme-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </label>

            <h2>Live Readings</h2>
            <div className="readings">
                <div className="reading-box">
                    <h3>Voltage</h3>
                    <p>{latestReading.voltage} V</p>
                </div>
                <div className="reading-box">
                    <h3>Current</h3>
                    <p>{latestReading.current} A</p>
                </div>
                <div className="reading-box">
                    <h3>Power</h3>
                    <p>{latestReading.power} W</p>
                </div>
                <div className="reading-box">
                    <h3>Timestamp</h3>
                    <p>{new Date(latestReading.timestamp).toLocaleString()}</p>
                </div>
            </div>

            <h2>Live Units and Bill Amount</h2>
            <div className="readings">
                <div className="reading-box">
                    <h3>Total Energy Consumed</h3>
                    <p>{totalEnergy} kWh</p>
                </div>
                <div className="reading-box">
                    <h3>Live Bill Amount</h3>
                    <p>₹{totalBill}</p>
                </div>
            </div>

            <h2>Download, Send SMS, or Email Bill</h2>
            <div>
                <button onClick={generatePDFBase64}>Download PDF</button>
                <button onClick={sendSMS}>Send Bill to Mobile</button>
                <button onClick={emailBill}>Send Bill via Email</button>
            </div>
        </div>
    );
}

export default BillCalculator;
