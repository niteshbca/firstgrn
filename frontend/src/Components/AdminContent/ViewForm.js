import React, { useEffect, useState } from 'react';
import styles from '../../Components/Approval/Approval.module.css';
import axios from 'axios';
import TableComponent from '../../Components/Table/Table.rendering';
import LogOutComponent from '../LogOut/LogOutComponent';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ViewForm({ managerType }) {
    const [visibleItem, setVisibleItem] = useState(null);
    const [selectedValue, setSelectedValue] = useState({});
    const [list, setList] = useState([]);
    const [showHideState, setShowHideState] = useState({});
    const [grnList, setGrnList] = useState([]);
    const [grnShowHideState, setGrnShowHideState] = useState({});
    const [grnSelectedValue, setGrnSelectedValue] = useState({});
    const [combinedList, setCombinedList] = useState([]);
   
    const handleDownloadPDF = (index) => {
        const divElement = document.getElementById(`div-${index}`);
        if (!divElement) return;

        // Get the party name from the document
        const partyName = combinedList[index]?.partyName || `document-${index}`;
        const sanitizedPartyName = partyName.replace(/[^a-zA-Z0-9]/g, '_');

        // Hide file sections and download button before capturing
        const fileSections = divElement.querySelectorAll('.file-section');
        const downloadButton = divElement.querySelector('.download-pdf-button');
        
        // Store original display values
        const originalDisplayValues = {
            fileSections: Array.from(fileSections).map(section => section.style.display),
            downloadButton: downloadButton ? downloadButton.style.display : null
        };

        // Hide elements
        fileSections.forEach(section => {
            section.style.display = 'none';
        });
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }

        // Add a small delay to ensure elements are hidden
        setTimeout(() => {
            html2canvas(divElement, { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");

                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                pdf.save(`${sanitizedPartyName}.pdf`);

                // Restore original display values
                fileSections.forEach((section, i) => {
                    section.style.display = originalDisplayValues.fileSections[i];
                });
                if (downloadButton) {
                    downloadButton.style.display = originalDisplayValues.downloadButton;
                }
            });
        }, 100);
    };
  
    managerType = 'Account Manager'
    const managerFieldMap = {
        'General Manager': 'GeneralManagerSigned',
        'Store Manager': 'StoreManagerSigned',
        'Purchase Manager': 'PurchaseManagerSigned',
        'Account Manager': 'AccountManagerSigned',
        'isHidden':'isHidden'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const url = process.env.REACT_APP_BACKEND_URL;
                
                // Fetch both GSN and GRN data concurrently
                const [gsnResponse, grnResponse] = await Promise.all([
                    axios.get(`${url}/gsn/getdata`, {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                    }),
                    axios.get(`${url}/entries/getdata1`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                console.log('GSN Data:', gsnResponse.data);
                console.log('GRN Data:', grnResponse.data);

                // Set the data
                setList(gsnResponse.data || []);
                setGrnList(grnResponse.data || []);

                // Combine the data
                const combined = {};
                
                // Process GSN documents
                (gsnResponse.data || []).forEach(doc => {
                    if (!combined[doc.partyName]) {
                        combined[doc.partyName] = {
                            partyName: doc.partyName,
                            gsnDocuments: [],
                            grnDocuments: [],
                            isHidden: doc.isHidden
                        };
                    }
                    combined[doc.partyName].gsnDocuments.push(doc);
                });

                // Process GRN documents
                (grnResponse.data || []).forEach(doc => {
                    if (!combined[doc.partyName]) {
                        combined[doc.partyName] = {
                            partyName: doc.partyName,
                            gsnDocuments: [],
                            grnDocuments: [],
                            isHidden: doc.isHidden
                        };
                    }
                    combined[doc.partyName].grnDocuments.push(doc);
                });

                const combinedList = Object.values(combined);
                console.log('Combined List:', combinedList);
                setCombinedList(combinedList);

            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error details:', error.response?.data);
            }
        };

        fetchData();
    }, []);

    const showHandler = (index) => {
        setVisibleItem(visibleItem === index ? null : index);
    };
    
    const handleRadioChange = async (e, partyName) => {
        e.preventDefault();
        const newHiddenState = !showHideState[partyName];
    
        try {
            const url = process.env.REACT_APP_BACKEND_URL;
            
            // Update visibility for all documents of this party
            const partyDocs = combinedList.find(doc => doc.partyName === partyName);
            if (partyDocs) {
                // Update GSN documents
                for (const doc of partyDocs.gsnDocuments) {
            await axios.post(`${url}/verify`, {
                        _Id: doc._id,
                        isHidden: newHiddenState,
                    });
                }
                
                // Update GRN documents
                for (const doc of partyDocs.grnDocuments) {
                    await axios.post(`${url}/verify`, {
                        _Id: doc._id,
                isHidden: newHiddenState, 
            });
                }
            }
    
            setShowHideState(prevState => ({
                ...prevState,
                [partyName]: newHiddenState
            }));
    
            alert(`All documents for ${partyName} are now ${newHiddenState ? 'Hidden' : 'Visible'} successfully`);
        } catch (err) {
            console.error("Error updating visibility status", err);
        }
    };
    
    const url = process.env.REACT_APP_BACKEND_URL;
    
    const renderDocument = (item, index) => {
        const { partyName, gsnDocuments, grnDocuments } = item;
        console.log('Rendering document for party:', partyName);
        console.log('GSN Documents:', gsnDocuments);
        console.log('GRN Documents:', grnDocuments);

                return (
                    <div key={index} id={`div-${index}`} className="generated-div" style={{ border: "1px solid black", padding: "20px", margin: "10px", background: "#f9f9f9" }}>
                <div className={styles.show}>
                        <h2 onClick={() => showHandler(index)}>Party Name: {partyName}</h2>
                        <div className={styles.completeBlock} style={{ display: visibleItem === index ? 'block' : 'none' }}>
                        {/* GSN Documents Section */}
                        {gsnDocuments && gsnDocuments.length > 0 && (
                            <div>
                                <h3 style={{ textAlign: 'center', margin: '20px' }}>GSN Documents</h3>
                                {gsnDocuments.map((doc, docIndex) => (
                                    <div key={`gsn-${docIndex}`} className={styles.grinDetails}>
                                        {/* GRIN Details */}
                                        <div><label htmlFor=""><h5>GSN Details</h5></label></div>
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
                                                    <td>{doc.grinNo}</td>
                                                    <td>{doc.grinDate}</td>
                                                    <td>{doc.gsn}</td>
                                                    <td>{doc.gsnDate}</td>
                                                    <td>{doc.poNo}</td>
                                                    <td>{doc.poDate}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Party Details */}
                                        <div className={styles.grinDetails}>
                                            <label htmlFor=""><h5>Party Details</h5></label>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Party Name</th>
                                                        <th>Party Invoice No.</th>
                                                      {/* <th>Received From</th>*/}
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{doc.partyName}</td>
                                                        <td>{doc.innoviceno}</td>
                                                      {/*  <td>{doc.receivedFrom}</td>*/}
                                                        <td>{doc.innoviceDate}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Transport Details */}
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
                                                        <td>{doc.lrNo}</td>
                                                        <td>{doc.transName}</td>
                                                        <td>{doc.vehicleNo}</td>
                                                        <td>{doc.lrDate}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Material Info */}
                                        {doc.tableData && doc.tableData.length > 0 && (
                                            <div style={{
                                                border: "1px solid #ccc",
                                                width: "90%",
                                                margin: "2% auto",
                                                display: "flex",
                                                justifyContent: "center",
                                                flexDirection: "column",
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
                                                <h5 style={{ textAlign: "center" }}>Material List:-</h5>
                                                <TableComponent tableData={doc.tableData} />
                                            </div>
                                        )}

                                        {/* File Section */}
                                        {doc.file && (
                                            <div className="file-section" style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                margin: "20px 0",
                                                padding: "15px",
                                                backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                            }}>
                                                <div style={{ textAlign: "center" }}>
                                                    <h2 style={{
                                                        color: "#007bff",
                                                        fontSize: "24px",
                                                        marginBottom: "10px",
                                                        textDecoration: "underline"
                                                    }}>Bill Details</h2>
                                                    <a href={`${url}/${doc.file}`} target="_blank" rel="noopener noreferrer" style={{
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
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* GRN Documents Section */}
                        {grnDocuments && grnDocuments.length > 0 && (
                            <div>
                                <h3 style={{ textAlign: 'center', margin: '20px' }}>GRIN Documents</h3>
                                {grnDocuments.map((doc, docIndex) => (
                                    <div key={`grn-${docIndex}`} className={styles.grinDetails}>
                                        {/* GRIN Details */}
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
                                                    <td>{doc.grinNo}</td>
                                                    <td>{doc.grinDate}</td>
                                                    <td>{doc.gsn}</td>
                                                    <td>{doc.gsnDate}</td>
                                                    <td>{doc.poNo}</td>
                                                    <td>{doc.poDate}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                        {/* Party Details */}
                            <div className={styles.grinDetails}>
                                <label htmlFor=""><h5>Party Details</h5></label>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Party Name</th>
                                            <th>Party Invoice No.</th>
                                            {/*<th>Received From</th>*/}
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                                        <td>{doc.partyName}</td>
                                                        <td>{doc.innoviceno}</td>
                                                       {/* <td>{doc.receivedFrom}</td>*/}
                                                        <td>{doc.innoviceDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                                        {/* Transport Details */}
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
                                                        <td>{doc.lrNo}</td>
                                                        <td>{doc.transName}</td>
                                                        <td>{doc.vehicleNo}</td>
                                                        <td>{doc.lrDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Material Info */}
                                        {doc.tableData && doc.tableData.length > 0 && (
                            <div style={{
                                border: "1px solid #ccc",
                                width: "90%",
                                margin: "2% auto",
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
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
                                                <h5 style={{ textAlign: "center" }}>Material List:-</h5>
                                                <TableComponent tableData={doc.tableData} />
                            </div>
                                        )}

                                        {/* File Section */}
                                        {doc.file && (
                            <div className="file-section" style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "20px 0",
                                padding: "15px",
                                backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
                                <div style={{ textAlign: "center" }}>
                                    <h2 style={{
                                        color: "#007bff",
                                        fontSize: "24px",
                                        marginBottom: "10px",
                                        textDecoration: "underline"
                                    }}>Bill Details</h2>
                                                    <a href={`${url}/${doc.file}`} target="_blank" rel="noopener noreferrer" style={{
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
                                                </div>
                                            </div>
                                    )}
                                </div>
                                ))}
                            </div>
                        )}

                        {/* Common Details Section */}
                        <div className={styles.sign} style={{
                                width: '90%',
                                display: 'flex',
                                margin: '5px',
                                padding: '1px',
                                backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                justifyContent: 'center',
                                alignItems: "center",
                                border: "1px solid #ccc",
                                borderRadius: "10px"
                        }}>
                            <form style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                <div className={styles.submission}>
                                    <div>
                                        <label htmlFor="Verify"><h6>General Manager,</h6></label>
                                        <br/><center>
                                        <input
                                            name={`checkbox-${index}`}
                                            style={{
                                                width: '12px',
                                                height: '20px',
                                                transform: 'scale(1.5)',
                                                cursor: 'pointer',
                                                marginLeft: '10px'
                                            }}
                                            value='checked'
                                            type="checkbox"
                                            checked={gsnDocuments[0]?.GeneralManagerSigned || grnDocuments[0]?.GeneralManagerSigned}
                                        /></center>
                                    </div>
                                    <div>
                                        <label htmlFor="Verify"><h6>Store Manager,</h6></label>
                                        <br/><center>
                                        <input
                                            name={`checkbox-${index}`}
                                            style={{
                                                width: '12px',
                                                height: '20px',
                                                transform: 'scale(1.5)',
                                                cursor: 'pointer',
                                                marginLeft: '10px'
                                            }}
                                            value='checked'
                                            type="checkbox"
                                            checked={gsnDocuments[0]?.StoreManagerSigned || grnDocuments[0]?.StoreManagerSigned}
                                        /></center>
                                    </div>
                                    <div>
                                        <label htmlFor="Verify"><h6>Purchase Manager,</h6></label>
                                       <br/> <center>
                                        <input
                                            name={`checkbox-${index}`}
                                            style={{
                                                width: '12px',
                                                height: '20px',
                                                transform: 'scale(1.5)',
                                                cursor: 'pointer',
                                                marginLeft: '10px'
                                            }}
                                            value='checked'
                                            type="checkbox"
                                            checked={gsnDocuments[0]?.PurchaseManagerSigned || grnDocuments[0]?.PurchaseManagerSigned}
                                        /></center>
                                    </div>
                                    <div>
                                        <label htmlFor="Verify"><h6>Account Manager</h6></label>
                                        <br/><center>
                                        <input
                                            name={`checkbox-${index}`}
                                            style={{
                                                width: '12px',
                                                height: '20px',
                                                transform: 'scale(1.5)',
                                                cursor: 'pointer',
                                                marginLeft: '10px'
                                            }}
                                            value='checked'
                                            type="checkbox"
                                            checked={gsnDocuments[0]?.AccountManagerSigned || grnDocuments[0]?.AccountManagerSigned}
                                        /></center>
                                    </div>
                                    <br />
                                    <div>
                                        <button 
                                            style={{
                                                width: '100%',
                                            maxWidth: '100px',
                                            margin: '5px',
                                            padding: "0 10px",
                                                minWidth: "80px",
                                            borderRadius: '15px',
                                                border: '2px solid transparent',
                                            backgroundColor: 'rgba(230, 216, 224, 0.8)',
                                            color: 'black',
                                                fontSize: '1rem',
                                                transition: 'background-color 0.3s ease',
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(230, 216, 224, 0.8)"}
                                            onClick={(e) => handleRadioChange(e, partyName)}
                                        >
                                            {showHideState[partyName] ? 'UnHide' : 'Hide'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        </div>
                        <button 
                            onClick={() => handleDownloadPDF(index)} 
                            className="download-pdf-button"
                            style={{ 
                                marginTop: "10px", 
                                padding: "5px 10px", 
                                background: "blue", 
                                color: "white", 
                                border: "none", 
                                cursor: "pointer",
                                display: "block" 
                            }}
                        >
                            Download PDF
                        </button>
                    </div>
                    </div>
                );
    };

    console.log('Current combinedList:', combinedList);

    return (
        <>
            <LogOutComponent/>
            <div className={styles.outer} style={{minHeight:"150vh"}}>
                {combinedList && combinedList.length > 0 ? (
                    combinedList.map((item, index) => renderDocument(item, index))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h2>No documents found</h2>
                        <p>Please check if the backend server is running and data is available.</p>
                    </div>
                )}
        </div>
        </>
    );
}
