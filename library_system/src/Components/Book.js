import React, { useState,useEffect } from 'react'
import Modal from 'react-modal'
import bufferToDataUrl from "buffer-to-data-url"

Modal.setAppElement('#root')
const Book = ({data=null,onClick=null}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [bookName, setBookName] = useState("")
    const [bookAuthor, setBookAuthor] = useState("")
    const [dataUri, setDataUri] = useState("")
    const [blobImage, setBlobImage] = useState("")
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
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to an ArrayBuffer
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }
    
        var dataView = new DataView(arrayBuffer);
        var blob = new Blob([dataView.buffer], { type: mimeString });
        return blob;
    }

    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })

        const onChange = (file) => {
    
            if(!file) {
              setDataUri('');
              return;
            }
        
            fileToDataUri(file)
              .then(dataUri => {

                var blob = dataURItoBlob(dataUri);
                setBlobImage(blob)
                console.log(blob)

                setDataUri(dataUri)
              })
            
          }

    const handleBookNameChange = e => {
        setBookName(e.target.value);
    }
    const handleAuthorChange = e => {
        setBookAuthor(e.target.value);
    }
    const addBook = e => { 
        e.preventDefault();
        try{
          let data = {
            book_name: bookName,
            book_author: bookAuthor,
            coverImg: blobImage
          }
          fetch("http://localhost:4000/books",{
            method: "POST",
            body:JSON.stringify(data),
            mode:"cors",
            headers: {"Content-type":"application/json;charset=utf-8"}})
            .then( 
                setBookName(""),
                setBookAuthor("")
            )
        }catch(err){
            console.log(err);
        }
    }
    return (
         data ? (
        <div className="book-MainContainer" onClick={onClick}>
            <div className="bookCover-Container">
            <div className="book-container">
                <div className="book">
                    <img alt="Cover"
                    src={dataSrc}//"https://i.guim.co.uk/img/media/70f5ffb1240b4a6bcacbc4ca6752909e00f8291a/0_0_2359_3543/master/2359.jpg?width=700&quality=85&auto=format&fit=max&s=08d1bff6b1f52530a3f399e44dc1b1f4"  
                    />
                </div>
                </div>
            </div>

            <h3 className="book-Title">{data ? data.book_name:"ADD BOOK"}</h3>
            <div className="book-Author">{data ?data.book_author:"Click to Add"}</div>
            
            
        </div>) : (<>
            <div className="addBook" onClick={() => setModalIsOpen(true)}>
                <img alt="Cover"
                src="https://www.shareicon.net/data/256x256/2016/06/27/623443_book_256x256.png"  
                />
                <div className="addBook-Title">{data ? data.book_name:"ADD BOOK"}</div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}
                    style={
                        {
                            overlay:{backgroundColor:'#616161',opacity:.98},
                            content:{color: 'black',opacity:10}
                        }
                    }
                    >
                    <div className="Modal-Content">
                        <div className="Modal-Close-Container"> Add Book
                            <button className="Modal-Close-Button" onClick={() => setModalIsOpen(false)}>✖</button>
                        </div>
                        <div className="Modal-Content-Container">
                            <div className="Modal-BookCover-Container">
                                <div className="Modal-Book-container">
                                    <div className="book">
                                        <img alt="Cover"
                                        src={dataUri}
                                        />
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="img">Upload Cover: &nbsp;&nbsp;&nbsp;</label><br/>
                            <input type="file" className="uploadCover" name="img" accept="image/*" 
                            onChange={(event) => onChange(event.target.files[0] || null)}
                            /> <br/>

                            <label htmlFor="bookTitle"> Book Title</label><br/>
                            <input name="bookTitle" value={bookName} onChange={handleBookNameChange} type="text" ></input><br/>
                            <label htmlFor="bookAuthor"> Book Author</label><br/>
                            <input name="bookAuthor" value={bookAuthor} onChange={handleAuthorChange} type="text" ></input><br/>
                            <button className="BorrowButton" onClick={addBook}> Add Book</button>
                        </div>
                    </div>
                </Modal>
        </>)
    )
}

export default Book
