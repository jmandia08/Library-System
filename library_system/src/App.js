import React, { useState, useEffect} from 'react'
import Books from './Components/Books'
import Book from './Components/Book'
import Login from './Components/Login'
import Logs from './Components/Logs'
import Modal from 'react-modal'


Modal.setAppElement('#root')
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items,setItems] = useState([]);
  const [userInfo,setUserInfo] = useState([]);
  const [errors,setErrors] = useState('');
  const [searchFor,setSearchFor] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const database =
      fetch('http://localhost:4000/books')
      .then(res => res.json())
      .then(datum => {
          setItems(datum);
    })
    return database
  },[])

  const handleUserChange = e => {
    setUsername(e.target.value);
  }
  const handlePassChange = e => {
    setPassword(e.target.value);
  }
  const handleSearchChange = e => {
    setSearchFor("");
    setSearchFor(e.target.value);
  }
  const closeDiv = () => {
    setSearchFor("");
  }
  
  const loginUser = e => {
    e.preventDefault();
      try{
        let data = {
          user_uname: username,
          user_password: password
        }
        fetch("http://localhost:4000/users",{
          method: "POST",
          body:JSON.stringify(data),
          mode:"cors",
          headers: {"Content-type":"application/json;charset=utf-8"}})
          .then(res => res.json())
          .then(data => {
            if(data.length > 0){
              setUserInfo(data)
            }
            else{
              setErrors("Invalid Username / Password");
            }
          })
      }catch(err){
          console.log(err);
      }
  }
  const filterItems = e => {
    e.preventDefault();
    fetch('http://localhost:4000/books')
    .then(res => res.json())
    .then(datum => {
      datum = datum.filter((data) => data.book_name.includes(searchFor) || data.book_author.includes(searchFor))
        setItems(datum);
    })
  }
  const logout = () =>{
    setUserInfo([]);
    setUsername("");
    setPassword("");
    setErrors("")
  }
  const viewLogs = e => {
    e.preventDefault();
    setModalIsOpen(true);
  }
  if(!userInfo.length > 0){
      return <Login login={loginUser} handleUserChange={handleUserChange} handlePassChange={handlePassChange} error={errors}></Login>
  }
  else{
    return (
        <div className="App">
            <div className="Page-Header">
              <button onClick={() => logout() }>Log Out</button>
              <div className="Welcome">Welcome {userInfo[0].user_fullname}!</div>
              <h1 className="header">BROWSE BOOKS (<a href="##" onClick={viewLogs}>LOGS</a>)</h1>
              <div className="header search">
                  <input className="searchField" onBlur={handleSearchChange} placeholder="Search a book . . ." type="text"></input>
                  <button className="searchButton search" onClick={filterItems}> Search</button>
              </div>
            </div>
            <div className="Page-Body">
            <ul>
                {
                  items.length > 0 ? (
                    items.map(item => (
                      <li className="Books" key={item.book_id}>
                          <Books data={item}></Books>
                      </li>
                    ))
                  ) : (
                    searchFor ?
                  <div className="searchResult searchPart">No book associated with "{searchFor}" <div onClick={() => closeDiv()} className="searchPart closeResult">✖</div></div>
                  : null
                  )
                }
                <li className="Books" >
                  <Book></Book>
                </li>
              
            </ul>
            </div>
            
            
            <Modal className="Log-Modal" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
                style={
                    {
                        overlay:{backgroundColor:'#616161',opacity:.98},
                        content:{color: 'black',opacity:10}
                    }
                }
                >
                <div className="Log-Modal-Content">
                    <div className="Log-Modal-Close-Container"> Transaction Logs
                        <button className="Log-Modal-Close-Button" onClick={() => setModalIsOpen(false)}>✖</button>
                    </div>
                    <div className="Log-Modal-Content-Container">
                       <Logs></Logs>
                    </div>
                </div>
            </Modal>



        </div>
      );
  }
}

export default App;
