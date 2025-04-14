// import React, { useEffect, useState } from 'react';
// import Styles from './Admin.module.css';
// import Signup from '../../Components/Signup/Signup'; // Assuming you have a SignIn component
// import { useBlocker } from 'react-router-dom';
// // import Users from '../../Components/Users/Users';
// import axios from 'axios';
// import LogOutComponent from '../LogOut/LogOutComponent';

// export default function Admin() {

//   const [add, setadd] = useState('')
//   const [users, setUsers] = useState(null)
//   const [fetched, setFetched] = useState()
//   const [managers, setManagers] = useState([{ _id: 1, username: 5 }])
//   const [show, setShow] = useState(false)
//   const [position, setPosition] = useState('')
//   const [list,setList]=useState('')

//   const [reload, setReload] = useState(false);
//   const hide = () => {
//     setadd('')
//   }

//   const handleClick = (fetched,y) => {
//     setFetched(fetched)
//     setShow(!show)
//     setList(y)

//     // setUsers(<Users url={fetched} />)

//   }
//   console.log(fetched)
//   useEffect(() => {
//     const getAllData = async () => {
//       try {
//         const token = localStorage.getItem('authToken')
//         const url = process.env.REACT_APP_BACKEND_URL
//         const getData = await axios.get(`${url}${fetched}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         setManagers(getData.data || [])

//       } catch (err) {
//         console.log(err)
//       }
//     }
//     getAllData()
//   }, [fetched, reload])
//   const handleAdd = (x, y) => {
//     setadd(x)
//     setPosition(y)
//   }
//   const handleDelete = (_id, endpoint) => {
//     const postDelete = async () => {
//       try {
//         const token = localStorage.getItem("authToken")
//         const url = process.env.REACT_APP_BACKEND_URL
//         console.log(`${url}${endpoint}/delete/${_id}`)
//         const res = await axios.delete(`${url}${endpoint}/delete/${_id}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         )
//         setReload((prev) => !prev)
//       } catch (err) {
//         console.log(err)
//       }
//     }
//     postDelete()
//   }
//   return (
//     <>


//       <div style={{ width: '90vw' }}>
//         <LogOutComponent/>
//         <h1 style={{ textAlign: "center", margin: "15px", color: "" }}>Admin DashBoard</h1>
//         <div className={Styles.outerContainer

//         }>
//           <div className={Styles.admin}>

//             <div className={Styles.name}>Admin</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/admin', 'Admin')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/admin','Admin')} >Members </div>
//             </div>

//           </div>
//           <div className={Styles.admin}>
//             <div className={Styles.name}>GSN</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/gsn', 'gsn')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/gsn','gsn')} >Members </div>
//             </div>

//           </div>

//           <div className={Styles.admin}>
//             <div className={Styles.name}>GRIN</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/attendee', 'Creator')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/attendee','Creator')} >Members </div>
//             </div>

//           </div>
//           <div className={Styles.admin}>
//             <div className={Styles.name}>General Manager</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/generalmanager', 'General Manager')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/generalmanager','General Manager')}>Members </div>
//             </div>

//           </div>
//           <div className={Styles.admin}>

//             <div className={Styles.name}>Purchase Mnager</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/purchasemanager', 'Purchase Manager')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/purchasemanager','Purchase Manager')}>Members</div>
//             </div>
//           </div>
//           <div className={Styles.admin}>
//             <div className={Styles.name}>Store Manager</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/storemanager', 'Store Manager')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/storemanager','Store Manager')}>Members </div>
//             </div>

//           </div>
//           <div className={Styles.admin}>
//             <div className={Styles.name}>Accountant</div>
//             <div className={Styles.right}>
//               <div className={Styles.rightOne} onClick={(e) => handleAdd('/sign-up/accountmanager', 'Account Manager')}>Add </div>
//               <div className={Styles.rightSecond} onClick={() => handleClick('/getAll/accountmanager','Account Manager')}>Members </div>
//             </div>
//           </div>
//           <div className='list' style={{ display: show ? "block" : "none" }}>
//             <div style={{display:"flex",justifyContent:"center",color:"black",fontSize:"30px"}}>{list}</div>
//             <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
//               {managers.map((u, index) => (

//                 <li key={u._id} style={{
//                   display: 'flex',
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   margin: "20px",
//                   border: "1px solid black",
//                   padding:"10px",
//                   borderRadius:"5px",
//                   backgroundColor:"#2d2d2d",
//                   color:"white"
//                 }}  >
//                   <span>{index + 1}.</span>
//                   name: &nbsp; {u.name} <br /> username:&nbsp;&nbsp;{u.username} <img 
//                   style={{ height: '30px',color:"white",backgroundColor:"white"
//                    }} src="/delete.png" alt="no icon" onClick={() => handleDelete(u._id, `${fetched}`)} />
//                 </li>
//               ))}
//             </ol>
//           </div>
//           <div style={{display:"flex",justifyContent:"center",alignItems:"center",margin:"auto"}} ><Signup toadd={add} hide={hide} position={position} /></div>

//         </div>

//       </div>

//     </>
//   );
// }






// import React, { useEffect, useState } from 'react';
// import Styles from './Admin.module.css';
// import Signup from '../../Components/Signup/Signup'; // Assuming you have a SignIn component
// import axios from 'axios';
// import LogOutComponent from '../LogOut/LogOutComponent';

// export default function Admin() {
//   const [add, setadd] = useState('');
//   const [users, setUsers] = useState(null);
//   const [fetched, setFetched] = useState();
//   const [managers, setManagers] = useState([{ _id: 1, username: 5 }]);
//   const [show, setShow] = useState(false);
//   const [position, setPosition] = useState('');
//   const [list, setList] = useState('');
//   const [reload, setReload] = useState(false);

// const [formShow,setFormShow] =useEffect(false)

//   const hide = () => {
//     setadd('');
//   };
//   const onSubmit=()=>{
//     setFormShow()
//   }

//   const handleClick = (fetched, y) => {
//     setFetched(fetched);
//     setShow(!show);
//     setList(y);
//   };

//   useEffect(() => {
//     const getAllData = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         const url = process.env.REACT_APP_BACKEND_URL;
//         const getData = await axios.get(`${url}${fetched}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setManagers(getData.data || []);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getAllData();
//   }, [fetched, reload]);

//   const handleAdd = (x, y) => {
//     setadd(x);
//     setPosition(y);
//   };

//   const handleDelete = (_id, endpoint) => {
//     const postDelete = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         const url = process.env.REACT_APP_BACKEND_URL;
//         await axios.delete(`${url}${endpoint}/delete/${_id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setReload((prev) => !prev);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     postDelete();
//   };

//   return (
//     <div>
//       {formShow?
//       <div style=
//       {{
//         width: '100vw',
//          margin: 'auto',
//          padding: '20px',
//          background: 'linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07)',
//          animation: 'gradient 15s ease infinite',
//           }}>
//         <LogOutComponent />
//         <h1 style={{ textAlign: 'center', margin: '15px', color: '#2c3e50' }}>Admin DashBoard</h1>
//         <div className={Styles.outerContainer}
//         style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
//           {/* Admin Section */}
//           <div
//             className={Styles.admin}
//             style={{

//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>Admin</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/admin', 'Admin')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/admin', 'Admin')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
// {/* gsn */}
// <div
//             className={Styles.admin}
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>GSN</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/gsn', 'gsn')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/gsn', 'gsn')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
//           {/* grin */}
//           <div
//             className={Styles.admin}
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>GRIN</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/attendee', 'Creator')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/attendee', 'Creator')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
//           {/* purchasemanager */}
//           <div
//             className={Styles.admin}
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>Purchase Manager</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/purchasemanager', 'Purchase Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/purchasemanager', 'Purchase Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
//           {/* stormanager */}
//           <div
//             className={Styles.admin}
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>Store Manager</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/storemanager', 'Store Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/storemanager', 'Store Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
//           {/* generalmanager */}
//           <div
//             className={Styles.admin}
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>General Manager</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/generalmanager', 'General Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/generalmanager', 'General Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
//           {/* account */}
//           <div
//             className={Styles.admin}
//             style={{
//               backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               borderRadius: '10px',
//               padding: '15px',
//               margin: '10px 0',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//             }}
//           >
//             <div className={Styles.name}>Account Manager</div>
//             <div className={Styles.right}>
//               <div
//                 className={Styles.rightOne}
//                 onClick={(e) => handleAdd('/sign-up/accountmanager', 'Account Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
//               >
//                 Add
//               </div>
//               <div
//                 className={Styles.rightSecond}
//                 onClick={() => handleClick('/getAll/sccountmanager', 'Account Manager')}
//                 style={{
//                   cursor: 'pointer',
//                   padding: '10px',
//                   borderRadius: '5px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
//               >
//                 Members
//               </div>
//             </div>
//           </div>
//           {/* Repeat similar structure for other sections (GSN, GRIN, General Manager, etc.) */}

//           {/* List of Members */}
//           <div className="list" style={{ display: show ? 'block' : 'none' }}>
//             <div style={{ display: 'flex', justifyContent: 'center', color: 'black', fontSize: '30px' }}>{list}</div>
//             <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
//               {managers.map((u, index) => (
//                 <li
//                   key={u._id}
//                   style={{
//                     display: 'flex',
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     margin: '20px',
//                     border: '1px solid #ccc',
//                     padding: '10px',
//                     borderRadius: '5px',
//                     backgroundColor: '#f9f9f9',
//                     color: '#333',
//                     transition: 'background-color 0.3s ease',
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
//                   onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
//                 >
//                   <span>{index + 1}.</span>
//                   name: &nbsp; {u.name} <br /> username:&nbsp;&nbsp;{u.username}{' '}
//                   <img
//                     style={{ height: '30px', cursor: 'pointer' }}
//                     src="/delete.png"
//                     alt="no icon"
//                     onClick={() => handleDelete(u._id, `${fetched}`)}
//                   />
//                 </li>
//               ))}
//             </ol>
//           </div>

//           {/* Signup Form */}

//         </div>
//       </div>:
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
//             <Signup toadd={add} hide={hide} position={position} />
//           </div>
// }
//     </div>
//   );
// }










import React, { useEffect, useState } from 'react';
import Styles from './Admin.module.css';
import Signup from '../../Components/Signup/Signup'; // Assuming you have a SignIn component
import axios from 'axios';
import LogOutComponent from '../LogOut/LogOutComponent';
import { FaTimes } from 'react-icons/fa'; // Import a close icon from react-icons

export default function Admin() {
  const [add, setadd] = useState('');
  const [users, setUsers] = useState(null);
  const [fetched, setFetched] = useState();
  const [managers, setManagers] = useState([{ _id: 1, username: 5 }]);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState('');
  const [list, setList] = useState('');
  const [reload, setReload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const hide = () => {
    setadd('');
    setIsModalOpen(false); // Close the modal when the form is submitted
  };

  const handleClick = (fetched, y) => {
    setFetched(fetched);
    setShow(!show);
    setList(y);
  };

  useEffect(() => {
    const getAllData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const url = process.env.REACT_APP_BACKEND_URL;
        const getData = await axios.get(`${url}${fetched}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setManagers(getData.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    getAllData();
  }, [fetched, reload]);

  const handleAdd = (x, y) => {
    setadd(x);
    setPosition(y);
    setIsModalOpen(true); // Open the modal when "Add" is clicked
  };

  const handleDelete = (_id, endpoint) => {
    const postDelete = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const url = process.env.REACT_APP_BACKEND_URL;
        await axios.delete(`${url}${endpoint}/delete/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setReload((prev) => !prev);
      } catch (err) {
        console.log(err);
      }
    };
    postDelete();
  };

  return (
    <div>
      <div
        className={Styles.gradientBackground}
        
      >
        <LogOutComponent />
        <h1 style={{ textAlign: 'center', margin: '15px', color: '#2c3e50' }}>Admin DashBoard</h1>
        <div
          className={Styles.outerContainer}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Admin Section */}
          <div
            className={Styles.admin}
            style={{
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>Admin</div>
            <div className={Styles.right}>
              <div
                className={Styles.rightOne}
                onClick={(e) => handleAdd('/sign-up/admin', 'Admin')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Add
              </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/admin', 'Admin')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* gsn */}
          <div
            className={Styles.admin}
            style={{
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>GSN</div>
            <div className={Styles.right}>
              <div
                className={Styles.rightOne}
                onClick={(e) => handleAdd('/sign-up/gsn', 'gsn')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Add
              </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/gsn', 'GSN')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* grin */}
          <div
            className={Styles.admin}
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>GRIN</div>
            <div className={Styles.right}>
              <div
                className={Styles.rightOne}
                onClick={(e) => handleAdd('/sign-up/attendee', 'GRIN')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Add
              </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/attendee', 'Grin')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* purchasemanager */}
          <div
            className={Styles.admin}
            style={{
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>Purchase Manager</div>
            <div className={Styles.right}>
              <div
                className={Styles.rightOne}
                onClick={(e) => handleAdd('/sign-up/purchasemanager', 'Purchase Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Add
              </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/purchasemanager', 'Purchase Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* stormanager */}
          <div
            className={Styles.admin}
            style={{
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>Store Manager</div>
            <div className={Styles.right}>
              <div
                className={Styles.rightOne}
                onClick={(e) => handleAdd('/sign-up/storemanager', 'Store Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Add
              </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/storemanager', 'Store Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* generalmanager */}
          <div
            className={Styles.admin}
            style={{
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>General Manager</div>
            <div className={Styles.right}>
              <div
                className={Styles.rightOne}
                onClick={(e) => handleAdd('/sign-up/generalmanager', 'General Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Add
              </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/generalmanager', 'General Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* account */}
          <div
            className={Styles.admin}
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className={Styles.name}>Account Manager</div>             <div className={Styles.right}>               <div
              className={Styles.rightOne}
              onClick={(e) => handleAdd('/sign-up/accountmanager', 'Account Manager')}
              style={{
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: 'black',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
            >
              Add
            </div>
              <div
                className={Styles.rightSecond}
                onClick={() => handleClick('/getAll/accountmanager', 'Account Manager')}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'black',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor =  'rgba(255, 255, 255, 0.8)')}
              >
                Members
              </div>
            </div>
          </div>
          {/* Repeat similar structure for other sections (GSN, GRIN, General Manager, etc.) */}

          {/* List of Members */}
          <div className="list" style={{ display: show ? 'block' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'black', fontSize: '30px' }}>{list}</div>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
              {managers.map((u, index) => (
                <li
                  key={u._id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: '20px',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    color: '#333',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                >
                  <span>{index + 1}.</span>
                  name: &nbsp; {u.name} <br /> username:&nbsp;&nbsp;{u.username}{' '}
                  <img
                    style={{ height: '30px', cursor: 'pointer' }}
                    src="/delete.png"
                    alt="no icon"
                    onClick={() => handleDelete(u._id, `${fetched}`)}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Modal for Signup Form */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            // translate:(-50%,50%)
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              // backgroundColor: 'white',
              // padding: '20px',
              backgroundColor: 'rgba(218, 216, 224, 0.6)',
              borderRadius: '20px',
              width: '90%',
              maxWidth: '400px',
              position: 'relative',
            }}
          >
            <FaTimes
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '20px',
              }}
              onClick={() => setIsModalOpen(false)} // Close the modal when the cross icon is clicked
            />
            <Signup toadd={add} hide={hide} position={position} />
          </div>
        </div>
      )}
    </div>
  );
}