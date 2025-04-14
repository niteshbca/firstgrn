import React, { useEffect, useState } from 'react';
import styles from './Approval.module.css';
import axios from 'axios';
import TableComponent from '../Table/Table.rendering'
import LogOutComponent from '../LogOut/LogOutComponent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Sample({ managerType }) {
    const [visibleItem, setVisibleItem] = useState(null);
    const [selectedValue, setSelectedValue] = useState({});
    const [list, setList] = useState([]);
    const [gsnList, setGsnList] = useState([])
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isHovered, setIsHovered] = useState(false);


    const [isGsnDataLoaded, setIsGsnDataLoaded] = useState(false);
    const [isListDataLoaded, setIsListDataLoaded] = useState(false);

    //mapping
    const managerFieldMap = {
        'General Manager': 'GeneralManagerSigned',
        'Store Manager': 'StoreManagerSigned',
        'Purchase Manager': 'PurchaseManagerSigned'
    };
    const fieldName = managerFieldMap[managerType];

    const url = process.env.REACT_APP_BACKEND_URL

    // Function to fetch GSN data (extracted for reusability)
    const fetchingGsnData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Fetching GSN data with token:', token);
            const resData = await axios.get(`${url}/gsn/getdata`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const getData = resData.data;
            console.log('Fetched GSN Data:', getData);

            const fetchedList = getData.filter((u) => !u.isHidden); // Simplified check for false or undefined

            // Set initial state of the checkboxes based on fetched data
            const initialSelectedValue = fetchedList.reduce((acc, item) => {
                // Ensure fieldName is valid before accessing
                if (fieldName && item.hasOwnProperty(fieldName)) {
                  acc[item._id] = item[fieldName] === true ? 'checked' : 'not_checked';
                } else {
                  acc[item._id] = 'not_checked'; // Default if field doesn't exist
                }
                return acc;
            }, {});

            setGsnList(fetchedList); // Update with filtered list
            setSelectedValue(initialSelectedValue);
            setIsGsnDataLoaded(true); // Mark GSN data as loaded
        } catch (err) {
            console.error("Error fetching GSN data", err);
            if (err.response) {
              console.error('GSN Fetch Error Response:', err.response.data);
            }
        }
    };

    // Fetching GSN data on initial load
    useEffect(() => {
        fetchingGsnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [managerType]); // Re-fetch if managerType changes

    // Fetching GRN data
    useEffect(() => {
        const fetchingGrnData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                console.log('Fetching GRN data with token:', token);
                const resData = await axios.get(`${url}/getdata`, // Assuming this is the correct endpoint for GRN
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const data = resData.data;
                console.log('Fetched GRN Data:', data);
                const fetchedList = data.filter((u) => !u.isHidden);

                setList(fetchedList); // Assuming 'list' state is for GRN data
                setIsListDataLoaded(true); // Mark GRN data as loaded
            } catch (err) {
                console.error("Error fetching GRN data", err);
                 if (err.response) {
                    console.error('GRN Fetch Error Response:', err.response.data);
                 }
            }
        };
        fetchingGrnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showHandler = (index) => {
        setVisibleItem(visibleItem === index ? null : index);
    };

    // Handle form submission
    const handleSubmit = async (e, _Id) => {
        e.preventDefault();
        const currentStatus = selectedValue[_Id] || 'not_checked';
        const payload = {
            _Id,
            managerType,
            status: currentStatus
        };
        console.log('Submitting verification status:', payload);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${url}/verify`, payload, {
                 headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                 }
            });
            console.log('Verification Response:', response.data);
            alert('Verification status saved successfully');
            // Refetch GSN data to update the UI
            await fetchingGsnData(); 
        } catch (err) {
            console.error("Error saving verification status", err);
            if (err.response) {
                console.error('Verification Error Response:', err.response.data);
                alert(`Error: ${err.response.data.message || 'Could not save status'}`);
            } else {
                alert('An error occurred while saving the status.');
            }
        }
    };
    useEffect(() => {
        if (isGsnDataLoaded && isListDataLoaded) {
            if (list.length <= gsnList.length) {
                list.length = gsnList.length
                console.log("length is", gsnList.length, list.length)
            }
        }
    }, [isGsnDataLoaded, isListDataLoaded])


    const formatDate = (oldFormat) => {
        if (!oldFormat) return "N/A";
        const date = new Date(oldFormat);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'

        });
       
        return formattedDate
    }


    // Handle radio input change
    const handleRadioChange = (_Id, value) => {
        setSelectedValue(prev => ({ ...prev, [_Id]: value }));
    };

    // **** ADDED: PDF Download Handler ****
    const handleDownloadPDF = (index) => {
        const item = gsnList[index]; // Get the item data
        if (!item) return;
        
        const divElement = document.getElementById(`item-div-${item._id}`);
        if (!divElement) return;

        // Sanitize Party Name
        const partyName = item.partyName || `document-${item._id}`;
        const sanitizedPartyName = partyName.replace(/[^a-zA-Z0-9]/g, '_');

        // Sanitize Manager Type (comes from props)
        const sanitizedManagerType = managerType.replace(/[^a-zA-Z0-9]/g, '_');

        // Elements to hide in PDF
        const elementsToHide = divElement.querySelectorAll('.hide-in-pdf');
        
        // Store original display styles
        const originalDisplayStyles = [];
        elementsToHide.forEach(el => {
            originalDisplayStyles.push(el.style.display);
            el.style.display = 'none';
        });

        // Add a small delay
        setTimeout(() => {
            html2canvas(divElement, { 
                scale: 2,
                useCORS: true,
                logging: false, 
                backgroundColor: '#ffffff' // Ensure background for canvas
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let position = 0;
                const pageHeight = 295; // A4 height in mm
                let heightLeft = imgHeight;

                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // **** UPDATED: PDF Filename ****
                pdf.save(`${sanitizedPartyName}_${sanitizedManagerType}.pdf`);

                // Restore original display styles
                elementsToHide.forEach((el, i) => {
                    el.style.display = originalDisplayStyles[i];
                });
            }).catch(err => {
                console.error("Error generating PDF:", err);
                // Restore display styles even if PDF generation fails
                elementsToHide.forEach((el, i) => {
                    el.style.display = originalDisplayStyles[i];
                });
            });
        }, 100); // 100ms delay
    };

    return (
        <>
            <LogOutComponent />
            <div className={styles.outer}>

                {Array.from(gsnList).map((item, index) => {
                    const gsnItem = gsnList[index];
                    const defaultItem = {
                        _id: "0",
                        grinNo: false,
                        grinDate: "N/A",
                        gsn: "N/A",
                        gsnDate: "N/A",
                        poNo: "N/A",
                        poDate: "N/A",
                        partyName: "N/A",
                        innoviceno: "N/A",
                        innoviceDate: "N/A",
                        receivedFrom: "N/A",
                        lrNo: "N/A",
                        lrDate: "N/A",
                        transName: "N/A",
                        vehicleNo: "N/A",
                        file: "N/A",
                        GeneralManagerSigned: "N/A",
                        PurchaseManagerSigned: "N/A",
                        StoreManagerSigned: "N/A",
                        AccountManagerSigned: "N/A",
                        tableData: [],
                        createdAt: "N/A"
                    };
                    const {
                        _id,
                        grinNo,
                        grinDate,
                        gsn,
                        gsnDate,
                        poNo,
                        poDate,
                        partyName,
                        innoviceno,
                        innoviceDate,
                        receivedFrom,
                        lrNo,
                        lrDate,
                        transName,
                        vehicleNo,
                        file,
                        tableData,
                        createdAt
                    } = item;
                   
                    const materialList = Array.isArray(tableData) ? tableData : [];

                    // **** ADDED: Approval Status Check (using item.*) ****
                    const isApprovedByAllThree = !!item.GeneralManagerSigned && !!item.PurchaseManagerSigned && !!item.StoreManagerSigned;
                    const statusText = isApprovedByAllThree ? "(Approved)" : "(Not Approved)";

                    // Logic to enable current manager's checkbox
                    const isCheckboxEnabled = !!grinNo; 

                    return (

                        <div key={index} id={`item-div-${_id}`} className={styles.show}>
                            <h2
                                style={{
                                    color: "black",
                                    // Add inline hover effect by changing style when isHovered is true
                                    // backgroundColor: isHovered ? "rgba(218, 216, 224, 0.6)" : "transparent",
                                    // padding: isHovered ? "25px" : '',
                                    cursor: "pointer",
                                    // boxShadow: isHovered ? "0px 4px 12px rgba(0,0,0,0.2)" : "none",
                                    // borderRadius: isHovered ? "8px" : "0",                  // Add border radius on hover
                                    transition: "all 0.3s ease",
                                    // transform: isHovered ? "scale(1.05)" : "scale(1)", 
                                    transition: "background-color 0.3s ease",
                                }}
                                onClick={() => showHandler(index)}
                                // onMouseEnter={() => setIsHovered(true)}
                                // onMouseLeave={() => setIsHovered(false)}
                            >
                                {partyName}
                                {/* **** ADDED: Status Indicator **** */}
                                <span style={{ marginLeft: '10px', fontSize: '0.8em', color: isApprovedByAllThree ? 'green' : 'orange' }}>
                                    {statusText}
                                </span>
                            </h2>

                            <div style={{ display: "flex", flexDirection: "row" }}>

                                {/* GSN Section */} 
                                <div className={styles.completeBlock} style={{ display: visibleItem === index ? 'block' : 'none' }}>
                                    {/* GSN details rendering using 'item' fields */}
                                    <div className={styles.grinDetails}>
                                        <h1 style={{ textAlign: "center" }}>GSN</h1>
                                        <div><label htmlFor=""><h5>GRIN Details</h5></label></div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>GRIN NO.</th>
                                                    <th>Date</th>
                                                    <th>GSN</th>
                                                    <th>Date</th>
                                                    <th>P.O. No.</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{grinNo}</td>
                                                    <td>{formatDate(grinDate)}</td>
                                                    <td>{gsn}</td>
                                                    <td>{formatDate(gsnDate)}</td>
                                                    <td>{poNo}</td>
                                                    <td>{formatDate(poDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* **** ADDED: GSN Party Details **** */}
                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Party Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Party Name</th>
                                                    <th>Party Invoice No.</th>
                                                    
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{partyName}</td>
                                                    <td>{innoviceno}</td>
                                                   {/* <td>{receivedFrom}</td>*/}
                                                    <td>{formatDate(innoviceDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* **** ADDED: GSN Transport Details **** */}
                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Transport Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>L.R. No.</th>
                                                    <th>Transporter Name</th>
                                                    <th>Vehicle No.</th>
                                                    <th>L.R. Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{lrNo}</td>
                                                    <td>{transName}</td>
                                                    <td>{vehicleNo}</td>
                                                    <td>{formatDate(lrDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* GSN Material List using item.tableData */} 
                                    <div style={{
                                        border: "1px solid #ccc",
                                        width: "90%",
                                        margin: "2% auto",
                                        padding: "20px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                        backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        fontFamily: "'Arial', sans-serif",
                                        fontSize: "16px",
                                        lineHeight: "1.6",
                                        boxSizing: "border-box",
                                        maxWidth: "1200px",
                                        overflowWrap: "break-word",
                                    }}>
                                        <h5 style={{ textAlign: "center" }}>Material List (GSN)</h5>
                                        <TableComponent tableData={materialList} />
                                    </div>
                                    {/* GSN CreatedAt using item.createdAt */} 
                                    <div className="timestamp" style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e0e0e0',
                                        margin: '20px auto',
                                        maxWidth: '400px',
                                        fontFamily: "'Roboto', sans-serif",
                                        color: '#333',
                                    }}>
                                        <h1 style={{
                                            fontSize: '24px',
                                            marginBottom: '10px',
                                            color: '#2c3e50',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>Created At (GSN)</h1>
                                        <p style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#34495e',
                                        }}>{formatDate(createdAt)}</p>
                                    </div>
                                    {/* GSN File Section using item.file */} 
                                    <div className="hide-in-pdf" style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "20px 0",
                                        padding: "15px",
                                        borderRadius: "8px",
                                    }}>
                                        <div style={{ textAlign: "center" }}>
                                            <h2 style={{
                                                color: "#007bff",
                                                fontSize: "24px",
                                                marginBottom: "10px",
                                                textDecoration: "underline"
                                            }}>Bill Details (GSN)</h2>
                                            {file ? (
                                                <a href={`${url}/${file}`} target="_blank" rel="noopener noreferrer" style={{
                                                    display: "inline-block",
                                                    padding: "10px 20px",
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    borderRadius: "5px",
                                                    transition: "background-color 0.3s ease"
                                                }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}>
                                                    View/Download File
                                                </a>
                                            ) : (
                                                <p style={{ color: "#dc3545", fontSize: "18px" }}>No file available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* GRN Section - **** CORRECTED TO USE listItem **** */} 
                                <div className={styles.completeBlock} style={{ display: visibleItem === index ? 'block' : 'none' }}>
                                    <div className={styles.grinDetails}>
                                        <h1 style={{ textAlign: "center" }}>GRIN</h1>
                                        <div><label htmlFor=""><h5>GRIN Details</h5></label></div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>GRIN NO.</th>
                                                    <th>Date</th>
                                                    <th>GSN</th>
                                                    <th>Date</th>
                                                    <th>P.O. No.</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {/* Use listItem fields, provide fallback */}
                                                    <td>{list[index]?.grinNo ?? 'N/A'}</td>
                                                    <td>{formatDate(list[index]?.grinDate)}</td>
                                                    <td>{list[index]?.gsn ?? 'N/A'}</td>
                                                    <td>{formatDate(list[index]?.gsnDate)}</td>
                                                    <td>{list[index]?.poNo ?? 'N/A'}</td>
                                                    <td>{formatDate(list[index]?.poDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Party Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Party Name</th>
                                                    <th>Party Invoice No.</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{list[index]?.partyName ?? 'N/A'}</td>
                                                    <td>{list[index]?.innoviceno ?? 'N/A'}</td>
                                                    <td>{formatDate(list[index]?.innoviceDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Transport Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>L.R. No.</th>
                                                    <th>Transporter Name</th>
                                                    <th>Vehicle No.</th>
                                                    <th>L.R. Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{list[index]?.lrNo ?? 'N/A'}</td>
                                                    <td>{list[index]?.transName ?? 'N/A'}</td>
                                                    <td>{list[index]?.vehicleNo ?? 'N/A'}</td>
                                                    <td>{formatDate(list[index]?.lrDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* GRN Material List using listItem.tableData */} 
                                    <div style={{
                                        border: "1px solid #ccc",
                                        width: "90%",
                                        margin: "2% auto",
                                        padding: "20px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                        backgroundColor: "rgba(218, 216, 224, 0.6)",
                                        fontFamily: "'Arial', sans-serif",
                                        fontSize: "16px",
                                        lineHeight: "1.6",
                                        boxSizing: "border-box",
                                        maxWidth: "1200px",
                                        overflowWrap: "break-word",
                                    }}>
                                        <h5 style={{ textAlign: "center" }}>Material List (GRIN)</h5>
                                        <TableComponent tableData={Array.isArray(list[index]?.tableData) ? list[index].tableData : []} />
                                    </div>
                                     {/* GRN CreatedAt using listItem.createdAt */} 
                                    <div className="timestamp" style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e0e0e0',
                                        margin: '20px auto',
                                        maxWidth: '400px',
                                        fontFamily: "'Roboto', sans-serif",
                                        color: '#333',
                                    }}>
                                        <h1 style={{
                                            fontSize: '24px',
                                            marginBottom: '10px',
                                            color: '#2c3e50',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>Created At (GRIN)</h1>
                                        <p style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#34495e',
                                        }}>{formatDate(list[index]?.createdAt)}</p>
                                    </div>
                                     {/* GRN File Section using listItem.file */} 
                                    <div className="hide-in-pdf" style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "20px 0",
                                        padding: "15px",
                                        borderRadius: "8px",
                                    }}>
                                        <div style={{ textAlign: "center" }}>
                                            <h2 style={{
                                                color: "#007bff",
                                                fontSize: "24px",
                                                marginBottom: "10px",
                                                textDecoration: "underline"
                                            }}>Bill Details (GRIN)</h2>
                                            {list[index]?.file ? (
                                                <a href={`${url}/${list[index].file}`} target="_blank" rel="noopener noreferrer" style={{
                                                    display: "inline-block",
                                                    padding: "10px 20px",
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    borderRadius: "5px",
                                                    transition: "background-color 0.3s ease"
                                                }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}>
                                                    View/Download File
                                                </a>
                                            ) : <p>No file available</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 3 */}
                            <div className={`${styles.sign} hide-in-pdf`}
                                style={{
                                    width: '90%',
                                    display: 'flex',
                                    margin: '5px',
                                    padding: '1px',
                                    // backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                    animation: "gradientBG 10s ease infinite",
                                    flexDirection: windowWidth <= 600 ? "column" : "row",
                                    // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    animation: 'fadeIn 1s ease',
                                    margin: windowWidth <= 600 ? '0' : '20px',
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    // border: "1px solid #ccc",
                                    borderRadius: "12px"
                                }}>
                                <form onSubmit={(e) => handleSubmit(e, _id)} style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                    <div className={styles.submission}>
                                        <div>
                                            <label htmlFor={`checkbox-${_id}`}><h6>Approve</h6></label>
                                            <br/><center> <input
                                                id={`checkbox-${_id}`}
                                                disabled={!isCheckboxEnabled}
                                                style={{
                                                    width: '12px', /* Adjust width */
                                                    height: '20px', /* Adjust height */
                                                    transform: 'scale(1.5)', /* Increase size */
                                                    cursor: !isCheckboxEnabled ? 'not-allowed' : 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                name={`checkbox-${_id}`}
                                                value='checked'
                                                type="checkbox"
                                                onChange={() => handleRadioChange(_id, selectedValue[_id] === 'checked' ? 'not_checked' : 'checked')} // Toggle
                                                checked={selectedValue[_id] === 'checked'}
                                            /></center>
                                        </div>
                                    </div>
                                    <button
                                        type='submit'
                                        className="hide-in-pdf"
                                        style={{
                                            width: '100%',
                                            maxWidth: '100px',
                                            margin: '5px',
                                            padding: "0 10px",
                                            minWidth: "80px",       // Increase padding for better touch interaction
                                            borderRadius: '15px',
                                            border: '2px solid transparent', // Solid border for better contrast
                                            backgroundColor: 'rgba(230, 216, 224, 0.8)',
                                            color: 'black',
                                            fontSize: '1rem',      // Relative font size for scalability
                                            transition: 'background-color 0.3s ease',  // Add smooth hover effect
                                            opacity: !isCheckboxEnabled ? 0.6 : 1,
                                            cursor: !isCheckboxEnabled ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(218, 216, 224, 0.8)"}
                                    >Submit</button>
                                </form>
                            </div>

                            {/* Conditional PDF Download Button */} 
                            {isApprovedByAllThree && (
                                <button 
                                    onClick={() => handleDownloadPDF(index)} 
                                    className="download-pdf-button hide-in-pdf" 
                                    style={{ 
                                        marginTop: "10px", 
                                        padding: "5px 10px",
                                        marginBottom:"20px", 
                                        background: "green", // Changed color
                                        color: "white", 
                                        border: "none", 
                                        cursor: "pointer",
                                        display: "block" 
                                    }}
                                >
                                    Download PDF
                                </button>
                            )}
                        </div>

                    );
                })}
            </div>

        </>
    );
}






