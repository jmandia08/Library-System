import React, { useState,useEffect } from 'react'
import Modal from 'react-modal'


const Logs = () => {
    const [items, setItems] = useState([])
    const [toUpdate, setToUpdate] = useState([])
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [tranID, setTranID] = useState("");
    const [returnDate, setReturnDate] = useState("")

    useEffect(() => {
        const data =
        fetch('http://localhost:4000/logs')
        .then(res => res.json())
        .then(datum => {
            setItems(datum);
      })
      return data;
    })
    const getBorrowDate = e => {
        setReturnDate(e.target.value)
        console.log("Return Date:"+e.target.value)
    }
    const updateRecord = () => {
        console.log(toUpdate.tranId) 
        console.log(returnDate) 
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date_returned: returnDate })
        };
        fetch('http://localhost:4000/updateLogs/'+toUpdate.tranId, requestOptions);
          setOpenUpdate(false)

    }
    const deleteRecord = () => {
        console.log(tranID);
        fetch('http://localhost:4000/deleteLogs/'+tranID, {
            method: 'DELETE'
          })
          setOpenDelete(false)
    }
    const onClickDelete = (trans_id) => {
        setOpenDelete(true)
        setTranID(trans_id)
    }
    const onClickUpdate = (record) => {
        setOpenUpdate(true)
        setToUpdate({
            "tranId" : record.tran_id,
            "bookId" : record.book_id,
            "bookName" : record.book_name,
            "user": record.user_fullname,
            "employee":record.employee_name,
            "dateBorrowed":record.date_borrowed,
            "dateReturned":record.date_returned,
        })
    }

    return (
        <div>
            <table border="1">
                <tbody className="columns">
                    <td className="Books logHeader">Transaction ID</td>
                    <td className="Books logHeader">Book ID</td>
                    <td className="Books logHeader">Book Name</td>
                    <td className="Books logHeader">Borrower Name</td>
                    <td className="Books logHeader">Borrowed From</td>
                    <td className="Books logHeader">Date Borrowed</td>
                    <td className="Books logHeader">Date Returned</td>
                    <td className="Books logHeader">Update</td>
                    <td className="Books logHeader">Delete</td>
                </tbody>
                {
                    items.map(item => (
                        <tr className="columns" key={item.tran_id}>
                            <td className="Books logData">{item.tran_id}</td>
                            <td className="Books logData">{item.book_id}</td>
                            <td className="Books logData">{item.book_name}</td>
                            <td className="Books logData">{item.user_fullname}</td>
                            <td className="Books logData">{item.employee_name}</td>
                            <td className="Books logData">{item.date_borrowed}</td>
                            <td className="Books logData">{item.date_returned}</td>
                            <td className="Books logData"><img onClick={() => onClickUpdate(item)} className="Update" alt="Update" src="http://simpleicon.com/wp-content/uploads/pencil.png"></img></td>
                            <td className="Books logData"><img onClick={() => onClickDelete(item.tran_id)} className="Delete" alt="Delete" src="https://cdn.iconscout.com/icon/premium/png-512-thumb/delete-1432400-1211078.png"></img></td>
                        </tr>
                    ))
                }
            </table>
            <Modal className="Update-Modal" isOpen={openUpdate} onRequestClose={() => setOpenUpdate(false)}
                style={
                    {
                        overlay:{backgroundColor:'#616161',opacity:.98},
                        content:{color: 'black',opacity:10}
                    }
                }
            >
                <div className="Update-Modal-Content">
                    <div className="Update-Modal-Close-Container"> Update Record
                        <button className="Update-Modal-Close-Button" onClick={() => setOpenUpdate(false)}>✖</button>
                    </div>
                    <div className="Update-Modal-Content-Container">
                        {
                            toUpdate ? (<>
                                <div className="updateFields">
                                    <label htmlFor="tranID"> Transaction ID</label><br/>
                                    <input name="tranID" value={toUpdate.tranId} type="text"disabled="disabled" ></input><br/>

                                    <label htmlFor="bookID"> Book ID</label><br/>
                                    <input name="bookID" value={toUpdate.bookId} type="text"disabled="disabled" ></input><br/>

                                    <label htmlFor="bookTitle"> Book Title</label><br/>
                                    <input name="bookTitle" value={toUpdate.bookName} type="text"disabled="disabled" ></input><br/>
                                </div>
                                <div className="updateFields">
                                    <label htmlFor="borrower"> Borrower</label><br/>
                                    <input name="borrower" value={toUpdate.user} type="text"disabled="disabled" ></input><br/>

                                    <label htmlFor="borrowedFrom"> Borrowed From</label><br/>
                                    <input name="borrowedFrom" value={toUpdate.employee} type="text"disabled="disabled" ></input><br/>
                                        
                                    <label htmlFor="borrowDate"> Borrow Date</label><br/>
                                    <input name="borrowDate" value={toUpdate.dateBorrowed} type="text"disabled="disabled" ></input><br/>
                                </div><br/>
                                <label htmlFor="returnDate">Return Date</label><br/>
                                <input onChange={getBorrowDate} type="date" name="returnDate"></input><br/>
                                <button className="BorrowButton" onClick={updateRecord}>Return Book</button>
                            </>)
                            : null
                        }
                    </div>
                </div>
            </Modal>
            <Modal className="Delete-Modal" isOpen={openDelete} onRequestClose={() => setOpenDelete(false)}
                style={
                    {
                        overlay:{backgroundColor:'#616161',opacity:.98},
                        content:{color: 'black',opacity:10}
                    }
                }
            >
                <div className="Delete-Modal-Content">
                    <div className="Delete-Modal-Close-Container"> Delete Record
                        <button className="Delete-Modal-Close-Button" onClick={() => setOpenDelete(false)}>✖</button>
                    </div>
                    <div className="Delete-Modal-Content-Container">
                        <div>
                            <h1 className="Question">Are you sure you want to delete this record?</h1>
                            <button className="ModalButtons" onClick={deleteRecord}>Yes</button>
                            <button className="ModalButtons" onClick={() => setOpenDelete(false)}>No</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Logs
