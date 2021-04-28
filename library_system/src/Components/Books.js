import React, { useState,useEffect } from 'react'
import Modal from 'react-modal'
import Book from './Book'
import bufferToDataUrl from "buffer-to-data-url"

Modal.setAppElement('#root')
const Books = ({data = null}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [employees, setEmployees] = useState([])
    const [address, setAddress] = useState("")
    const [bookId, setBookId] = useState("")
    const [userId, setUserId] = useState("")
    const [employeeId, setEmployeeId] = useState("")
    const [dateBorrowed, setDateBorrowed] = useState("")
    const [dataSrc, setDataSrc] = useState("")

    useEffect(()=>{
        if(data){
            var uri = arrayBufferToBase64(data.coverImg.data);
            const dataUrl = bufferToDataUrl("image/png", uri)
            setDataSrc(dataUrl);
        }
    },[data])
    function arrayBufferToBase64(buffer){
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const changeModalState = () => {
        setModalIsOpen(!modalIsOpen)
    }
    

    useEffect(() => {
        fetch('http://localhost:4000/usersList')
        .then(res => res.json())
        .then(datum => {
            setUsers(datum);
      })
    },[])
    useEffect(() => {
        fetch('http://localhost:4000/employeeList')
        .then(res => res.json())
        .then(datum => {
            setEmployees(datum);
      })
    },[])
    const getAddress = e => {
        setUserId(e.target.value);
        setBookId(data.book_id);
        console.log("User ID:"+e.target.value)
        console.log("Book ID:"+data.book_id)
        try{
            fetch("http://localhost:4000/users/"+e.target.value,{
              method: "POST",
              mode:"cors",
              headers: {"Content-type":"application/json;charset=utf-8"}})
              .then(res => res.json())
              .then(data => {
                if(data.length > 0){
                    setAddress(data[0].user_address)
                }
              })
          }catch(err){
              console.log(err);
          }
    }
    const getBorrowDate = e => {
        setDateBorrowed(e.target.value)
        console.log("Borrow Date:"+e.target.value)
    }
    const getEmployeeId = e => {
        setEmployeeId(e.target.value)
        console.log("Employee ID:"+e.target.value)
    }
    const borrowBook = e => { 
        e.preventDefault();
        try{
          let data = {
            book_id: bookId,
            user_id: userId,
            employee_id: employeeId,
            date_borrowed: dateBorrowed
          }
          fetch("http://localhost:4000/logs",{
            method: "POST",
            body:JSON.stringify(data),
            mode:"cors",
            headers: {"Content-type":"application/json;charset=utf-8"}})
            .then( 
                setBookId(""),
                setUserId(""),
                setEmployeeId(""),
                setDateBorrowed("")
            )
        }catch(err){
            console.log(err);
        }
    }
    return (
        <>
            <Book onClick={changeModalState} data={data}></Book>
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
                style={
                    {
                        overlay:{backgroundColor:'#616161',opacity:.98},
                        content:{color: 'black',opacity:10}
                    }
                }
            >
                <div className="Modal-Content">
                    <div className="Modal-Close-Container"> Borrow Book
                        <button className="Modal-Close-Button" onClick={() => setModalIsOpen(false)}>✖</button>
                    </div>
                    <div className="Modal-Content-Container">
                        <div className="Modal-BookCover-Container">
                        <div className="Modal-Book-container">
                            <div className="book">
                                <img alt="Cover"
                                 src={dataSrc}//"https://i.guim.co.uk/img/media/70f5ffb1240b4a6bcacbc4ca6752909e00f8291a/0_0_2359_3543/master/2359.jpg?width=700&quality=85&auto=format&fit=max&s=08d1bff6b1f52530a3f399e44dc1b1f4"  
                                />
                            </div>
                            </div>
                        </div>

                        <div className="Modal-Book-Title">{data.book_name}</div>
                        <div className="Modal-Book-Author">{data.book_author}</div>
                        <div className="Modal-Book-Id">{data.book_id}</div>
                        <fieldset>
                        <legend>Transaction Infromation</legend>
                            <label htmlFor="borrowerName"> Borrower Name</label><br/>
                            <select onChange={getAddress} className="borrowerList" name="borrowerName">
                                <option value=""></option>
                                {
                                users.map(user => (
                                    <option key={user.user_id} value={user.user_id}>{user.user_fullname}</option>
                                ))
                                }
                            </select><br/>
                            <label htmlFor="borrowerAdd"> Borrower Address</label><br/>
                            <input name="borrowerAdd" value={address} type="text"disabled="disabled" ></input><br/>
                            <label htmlFor="borrowDate">Date Borrowed</label><br/>
                            <input onChange={getBorrowDate} type="date" name="borrowDate"></input><br/>
                            <label htmlFor="borrowedFrom"> Borrowed From</label><br/>
                            <select onChange={getEmployeeId}  className="borrowerList" name="borrowedFrom">
                                <option value=""></option>
                                {
                                employees.map(employee => (
                                    <option key={employee.employee_id} value={employee.employee_id}>{employee.employee_name}</option>
                                ))
                                }
                            </select><br/>

                        </fieldset>
                        <button onClick={borrowBook} className="BorrowButton">Borrow Book</button>
                    </div>
                </div>
            
            </Modal>
        </>
    )
}

export default Books
