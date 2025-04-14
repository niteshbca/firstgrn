
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import style from '../Attendee/Inputgrin.module.css';
import styles from "../Attendee/Fileupload.module.css"; // Import the CSS module
import TableComponent from '../../Components/Table/TableEntry'; // Import the TableComponent
import LogOutComponent from '../../Components/LogOut/LogOutComponent';

export default function Gsn() {
    const [grinNo, setGrinNo] = useState("");
    const [grinDate, setGrinDate] = useState("");
    const [gsn, setGsn] = useState("");
    const [gsnDate, setGsnDate] = useState("");
    const [poNo, setPoNo] = useState("");
    const [poDate, setPoDate] = useState("");

    const [partyName, setpartyName] = useState("");
    const [innoviceno, setInnoviceno] = useState("");
    const [innoviceDate, setInnoviceDate] = useState("");
    const [receivedFrom, setReceivedFrom] = useState("");

    const [lrNo, setLrNo] = useState("");
    const [lrDate, setLrDate] = useState("");
    const [transName, setTransName] = useState("");
    const [vehicleNo, setVehicleNo] = useState("");

    const [materialInfo, setMaterialInfo] = useState(""); // State for textarea
    const [file, setFile] = useState(null);
    const [tableData, setTableData] = useState(
        Array.from({ length: 20 }, () => ({
            item: '',
            description: '',
            quantityNo: '',
            quantityKg: '',
        }))
    );

    const [backendData, setbackendData] = useState([])
    const [filteredbackend, setfilteredBackend] = useState([])
    const popupRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTableChange = (index, field, value) => {
        const updatedData = [...tableData];
        updatedData[index][field] = value;
        setTableData(updatedData);
    };

    const resetForm = () => {
        setGrinNo('');
        setGrinDate('');
        setGsn('');
        setGsnDate('');
        setPoNo('');
        setPoDate('');
        setpartyName('');
        setInnoviceno('');
        setInnoviceDate('');
        setReceivedFrom('');
        setLrNo('');
        setLrDate('');
        setTransName('');
        setVehicleNo('');
        setMaterialInfo('');
        setFile(null);
        setTableData(
            Array.from({ length: 20 }, (_, index) => ({
                item: `Item ${index + 1}`,
                description: `Description ${index + 1}`,
                quantityNo: '',
                quantityKg: '',
            }))
        );
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("grinNo", grinNo);
        formData.append("grinDate", grinDate);
        formData.append("gsn", gsn);
        formData.append("gsnDate", gsnDate);
        formData.append("poNo", poNo);
        formData.append("poDate", poDate);
        formData.append("partyName", partyName);
        formData.append("innoviceno", innoviceno);
        formData.append("innoviceDate", innoviceDate);
        formData.append("lrNo", lrNo);
        formData.append("lrDate", lrDate);
        formData.append("transName", transName);
        formData.append("vehicleNo", vehicleNo);
        formData.append("materialInfo", materialInfo); // Append textarea content
        formData.append("tableData", JSON.stringify(tableData)); // Append table data as JSON

        if (file) {
            formData.append("file", file);
        } else {
            alert("No File Selected");
        }

        try {
            const url = process.env.REACT_APP_BACKEND_URL;
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${url}/gsn/upload-data`, formData);
            console.log(response);
            alert("Details Submitted Successfully");
            resetForm();
        } catch (error) {
            alert("Error in uploading data");
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const url = process.env.REACT_APP_BACKEND_URL;
                const token = localStorage.getItem('authToken');
                const res = await axios.get(`${url}/gsn/getdata`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setbackendData(res.data);
                console.log(backendData);
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const func = async () => {
            const filtered = backendData.filter(u => u.partyName.toLowerCase().includes(partyName.toLowerCase()));
            setfilteredBackend(filtered);
            if (filtered.length > 0) {
                setIsVisible(true);
            } else {
                setIsVisible(false); // Hide popup when no match found
            }
        };
        func();
    }, [partyName]);

    const handleFocus = () => {
        setIsVisible(true);
    };

    const handleBlur = (event) => {
        setTimeout(() => setIsVisible(false), 1000);
    };

    const handleSelectParty = (party) => {
        setpartyName(party);
        setIsVisible(false); // Close popup after selection
    };

    // Inline CSS Styles
    const containerStyle = {
        width:"130%",
        overflow: 'hidden',
        textAlign: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 12s ease infinite',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: 'auto',
        marginRight: 'auto',
        
    };

    const globalStyles = `
    @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        25% { background-position: 50% 100%; }
        50% { background-position: 100% 50%; }
        75% { background-position: 50% 0%; }
        100% { background-position: 0% 50%; }
    }
    `;

    return (
        <>
            <LogOutComponent />
            <div style={containerStyle}>
                <style>{globalStyles}</style>
                <div style={{ width: "90vw", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div id="nav"
                        style={{
                            width: "90%",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: 'center',
                            fontSize: "25px",
                            padding: '10px',
                            marginTop: "20px"
                        }}
                    >
                        <h2>Inventory Details</h2>
                    </div>

                    <div style={{ width: "90vw", maxWidth: '700px' }}>
                        <form action="" onSubmit={submitHandler} style={{ margin: '40px', width: "100%" }}>
                            {/* GRIN NO. and Date */}
                            <div className={styles.form}>
                                <div className={styles.formRow}>
                                    <label className={styles.label}>GRIN NO:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        type="number"
                                        value={grinNo}
                                        onChange={(e) => setGrinNo(e.target.value)}
                                    />
                                    <input
                                        required
                                        className={styles.dateInput}
                                        style={{ margin: "10px", maxWidth: "500px" }}
                                        type="date"
                                        value={grinDate}
                                        onChange={(e) => setGrinDate(e.target.value)}
                                    />
                                </div>

                                {/* GSN and Date */}
                                <div className={styles.formRow}>
                                    <label className={styles.label}>GSN:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        type="text"
                                        value={gsn}
                                        onChange={(e) => setGsn(e.target.value)}
                                    />
                                    <input
                                        required
                                        className={styles.dateInput}
                                        type="date"
                                        style={{ margin: "10px" }}
                                        value={gsnDate}
                                        onChange={(e) => setGsnDate(e.target.value)}
                                    />
                                </div>

                                {/* P.O. NO. and Date */}
                                <div className={styles.formRow}>
                                    <label className={styles.label}>P.O. NO:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        type="text"
                                        value={poNo}
                                        onChange={(e) => setPoNo(e.target.value)}
                                    />
                                    <input
                                        required
                                        className={styles.dateInput}
                                        type="date"
                                        style={{ margin: "10px" }}
                                        value={poDate}
                                        onChange={(e) => setPoDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Party Details */}
                            <div className={styles.form}>
                                <div className={styles.formRow} style={{ position: "relative" }}>
                                    <label className={styles.label}>Party Name:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        style={{ marginLeft: '5px' }}
                                        type="text"
                                        value={partyName}
                                        onFocus={handleFocus}
                                        onBlur={(event) => handleBlur(event)}
                                        onChange={(e) => setpartyName(e.target.value)}
                                    />
                                    <div
                                        className='popUp'
                                        ref={popupRef}
                                        style={{
                                            display: isVisible ? 'block' : 'none',
                                            position: 'absolute',
                                            zIndex: '1000',
                                            top: '100%',
                                            width: '100%',
                                            border: '1px solid rgba(0, 0, 0, 0.1)', // Subtle border
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Light shadow for depth
                                            borderRadius: '8px', // Rounded corners
                                            padding: '16px', // Add padding for spacing
                                            transition: 'opacity 0.3s ease-in-out', // Smooth transition for visibility
                                            opacity: isVisible ? 1 : 0 // Fade in/out effect
                                        }}
                                    >
                                        <ul style={{ listStyle: 'none' }}>
                                            {filteredbackend.map((u, _id) => (
                                                <li key={u._id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectParty(u.partyName)
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >{u.partyName}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <input type="text" className={`${styles.dateInput} ${styles.dummy}`} style={{ visibility: "hidden" }} />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.label}>Party Invoice No:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        type="text"
                                        style={{ marginLeft: '4px', }}
                                        value={innoviceno}
                                        onChange={(e) => setInnoviceno(e.target.value)}
                                    />
                                    <input
                                        required
                                        className={styles.dateInput}
                                        type="date"
                                        style={{ marginTop: "25px" }}
                                        value={innoviceDate}
                                        onChange={(e) => setInnoviceDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Transport Details */}
                            <div className={styles.form}>
                                <div className={styles.formRow}>
                                    <label className={styles.label}>L.R. No:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        style={{ marginBottom: "20px" }}
                                        type="text"
                                        value={lrNo}
                                        onChange={(e) => setLrNo(e.target.value)}
                                    />
                                    <input
                                        required
                                        className={styles.dateInput}
                                        type="date"
                                        style={{ marginTop: "30px" }}
                                        value={lrDate}
                                        onChange={(e) => setLrDate(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.label}>Name of Transporter:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        type="text"
                                        value={transName}
                                        onChange={(e) => setTransName(e.target.value)}
                                    />
                                    <input type="text" className={`${styles.dateInput} ${styles.dummy}`} style={{ visibility: "hidden" }} />
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.label}>Vehicle No:</label>
                                    <input
                                        required
                                        className={styles.input}
                                        type="text"
                                        value={vehicleNo}
                                        onChange={(e) => setVehicleNo(e.target.value)}
                                    />
                                    <input type="text" className={`${styles.dateInput} ${styles.dummy}`} style={{ visibility: "hidden" }} />
                                </div>
                            </div>

                            {/* Material Information (Table) */}
                            <div className={styles.forms}>
                                <div className={styles.formRow} style={{ dissplay: "flex", flexDirection: 'column' }}>
                                    <label className={styles.label}>Material Information:</label>
                                    <TableComponent data={tableData} handleTableChange={handleTableChange} />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className={style.form}
                             style={{backgroundColor:"rgba(218, 216, 224, 0.6)" }}>
                                <div className={style.formRow}>
                                    <label className={style.label}>Upload Bill:</label>
                                    <label
                                        className={style.custom} htmlFor="file-upload">{file !== null ? `${file.name}` : 'Select File'}</label>
                                    <input
                                        required
                                        id='file-upload'
                                        className={style.fileInput}
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div id="btn">
                                <button style={{ width: "100%" }} className={style.button} id={styles.btn}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}