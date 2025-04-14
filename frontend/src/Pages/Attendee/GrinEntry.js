import React, { useState } from 'react'
import styles from '../Home/Home.module.css';
import { NavLink, redirect } from 'react-router-dom';
import LogOutComponent from '../../Components/LogOut/LogOutComponent';
import { useEffect } from 'react';
import axios from 'axios';

import { useContext } from 'react';
export default function GsnEntry() {
  const [backendData, setbackendData] = useState([])
 const [selectedvalue,setSelectedValue]=useState('')
 const [innoviceDate, setinnoviceDate] = useState('');

  useEffect(() => {
    const getData = async () => {
        try {
            const url = process.env.REACT_APP_BACKEND_URL
            const token = localStorage.getItem('authToken')
            const res = await axios.get(`${url}/gsn/getdata`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
           console.log(res.data)
            setbackendData(res.data)
            

        } catch (err) {
            console.log(err)
        }
    }
    getData()
}, [])
const handleSelectChange = (event) => {
  // setSelectedValue(event.target.value);  // Store the selected option's value
  // setGsnDate(event.target.getAttribute('data-gsn-date'));

  const selectedOption = event.target.selectedOptions[0];
  setSelectedValue(selectedOption.value);
  setinnoviceDate(selectedOption.getAttribute('data-gsn-date'));


};
console.log(selectedvalue)
console.log(innoviceDate)
const containerStyle = {
      
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

@media (max-width: 768px) {
  .formRow {
      flex-direction: column;
      align-items: flex-start;
  }
  .input, .dateInput {
      width: 100%;
      margin: 5px 0;
  }
  .popUp {
      width: 90%;
      left: 5%;
  }
  #nav h2 {
      font-size: 1.5rem;
  }
  .button {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
  }
}
`;
const style = {
  button: {
    backgroundColor: 'rgba(218, 216, 224, 0.8)',
    border: 'none',
    borderRadius: '28px',
    color: 'black',
    fontSize: '20px',
    fontFamily: `'Poppins', sans-serif`,
    fontWeight: 'normal',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#ff5722',
    transform: 'scale(1.05)',
  }
}

  return (
    <div  className={styles.outerContainer} style={containerStyle}
>
        <LogOutComponent/>
        <style>{globalStyles}</style>
      {/* <video autoPlay muted loop className={styles.videoBackground}>
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    <div>
        <select onChange={handleSelectChange} name="" id="" 
        style={{
            width:'auto',
            height:"42px",
            padding:"5px",
            border: 'none',
            borderRadius: '28px',
            color: 'black',
            backgroundColor: 'rgba(218, 216, 224, 0.8)',
            border:"1px black solid"
            }}>
            <option value="">Select Party Name</option>
            {backendData.map((u,i)=>(
              <option style={style.button} key={i} 
              value={u.partyName}
              data-gsn-date={u.innoviceDate}
              >{u.partyName}</option>
            ))}
        </select>
        <NavLink 
        to='/grin-dashboard/entry'
        state={{selectedvalue,innoviceDate}}
        > <button style={style.button}>Create GRIN</button></NavLink>
    </div>
      
    </div>
  )
}
