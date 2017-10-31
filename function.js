(function() {
  'use strict'
  //change "yourkey" with your own key
  let url = "https://opendata.tamk.fi/r1/computerstatus/computers/?apiKey=yourkey"
  
  /*function that assembles the page content once loaded
  */

  function Ready () {
    fetch(url).then((response) => response.json()).then((json) => {
    
    //create html tags
    let br = document.createElement("br")
    let selectroom = createRoomSelectOption(json) 
    let selectstatus = createStatusSelectOption(json)
    let table = createTable(json)
    let labelroom = document.createElement("label")
    let labelstatus = document.createElement("label")
    
    //text label
    labelroom.innerHTML =  "Room code : "
    labelstatus.innerHTML = "Status : "
    
    //places each created tag as children of the div element with id=content
    document.getElementById('content').appendChild(labelroom)
    document.getElementById('content').appendChild(selectroom)
    document.getElementById('content').appendChild(br)
    document.getElementById('content').appendChild(labelstatus)
    document.getElementById('content').append(selectstatus)
    document.getElementById('content').appendChild(table)
    })
  }

  /*function that creates the select html tag for computer status
  */
  function createStatusSelectOption (json) {
    
    //create html element
    let select = document.createElement("select")
    let optionSelect = document.createElement("option")
    let optionFree = document.createElement("option")
    let optionUse = document.createElement("option")

    //set the id attribute of the select element
    select.setAttribute('id', 'statusselect')

    //text value of the select option
    optionSelect.innerHTML = "Select"
    optionFree.innerHTML = "Free"
    optionUse.innerHTML = "Inuse"
    
    //place each option as children of select element
    select.appendChild(optionSelect)
    select.appendChild(optionFree)
    select.appendChild(optionUse)

    //add event listener to each option when selected
    select.addEventListener("change", clickSelectOption, false)    

    return select

  }

  /*function that creates the select html tag for room code
  */
  function createRoomSelectOption (json) {
  
    //create html element
    let select = document.createElement("select")
    let option = document.createElement("option")

    //set the id attribute of the select element
    select.setAttribute('id', 'roomselect')
    
    //declare array 
    var comparray = [] 
    var newcomparray
    
    //text value of the first option
    option.innerHTML = "Select"
    
    //place the option as the first child of the select element
    select.appendChild(option)
    
    for (let comp of json.computer) { 
      comparray.push(comp.room.roomCode) //insert each retrieve room code to the array
      comparray
      newcomparray = Array.from(new Set(comparray)) //create new array that contains only unique values                              
    }
    //convert the room code array as option and place it as children of select element
    for (let newcomp of newcomparray) {
      option = document.createElement("option")                
      option.innerHTML = newcomp
      select.appendChild(option)

      //add event lister to each option when selected
      select.addEventListener("change", clickSelectOption, false)                
    }              
      console.log(json.computer) //testing purposes to check the content of the json file
      return select
  }

  /*function that creates the table and the table header
  */
  function createTable(json, table) {
  
    //create table element
    table = document.createElement('table')

    //set class attribute of table element
    table.setAttribute('class', 'pure-table')

    //create row for the head element and the corresponding columns
    let thead = document.createElement('thead')
    let ttr = document.createElement('tr')
    let compNameth = document.createElement('th')
    let statusth = document.createElement('th')
    let campusth = document.createElement('th')
    let campusAreath = document.createElement('th')
    let roomCodeth = document.createElement('th')

    //text value of each column in the header
    compNameth.innerHTML = "Computer Name"
    statusth.innerHTML = "Status"
    campusth.innerHTML = "Campus"
    campusAreath.innerHTML = "Campus Area"
    roomCodeth.innerHTML = "RoomCode"

    //places each column as children of the row
    ttr.appendChild(compNameth) 
    ttr.appendChild(statusth)
    ttr.appendChild(campusth)
    ttr.appendChild(campusAreath)
    ttr.appendChild(roomCodeth)
    
    //places the row as child of the header
    thead.appendChild(ttr)

    //places the header as first child of the table
    table.appendChild(thead)

    //create the table body element
    let tbody = document.createElement('tbody')
    
    //places the body as second child of the table
    table.appendChild(tbody)

    return table
  }

  /*function creating the row content of the table body
  */
  function createRow(computer) {

    //create row element
    let tr = document.createElement('tr')
    
    //create column element
    let td1 = document.createElement('td')
    let td2 = document.createElement('td')
    let td3 = document.createElement('td')
    let td4 = document.createElement('td')
    let td5 = document.createElement('td')

    //text values of the column 
    td1.innerHTML = computer.computerName
    td2.innerHTML = computer.status
    td3.innerHTML = computer.room.campus
    td4.innerHTML = computer.room.campusArea
    td5.innerHTML = computer.room.roomCode

    //places each column as children of row element
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
      
    return tr
     
  }

  /*function tht act on once select option is clicked
  */
  function clickSelectOption (computer) {
      
    fetch(url).then((response) => response.json()).then((json) => {
      //initialization
      let selectvalueroom = document.querySelector("#roomselect").value
      let selectvaluestatus = document.querySelector("#statusselect").value
      let tbody = document.querySelector('tbody')
          
      $(tbody).empty() //empty the table body of any old row before appending the new row

      for (let computers of json.computer) {
        //different row values appended to table body when different select option is clicked
        if (computers.room.roomCode == selectvalueroom && selectvaluestatus == "Select") {
          let row = createRow(computers)
          tbody.appendChild(row)                        
        } else if (computers.room.roomCode == selectvalueroom && selectvaluestatus == "Free" && computers.status == "free") {
          let row = createRow(computers)
          tbody.appendChild(row) 
        } else if (computers.room.roomCode == selectvalueroom && selectvaluestatus == "Inuse" && computers.status == "inuse") {
          let row = createRow(computers)
          tbody.appendChild(row) 
        } else if (selectvalueroom == "Select" && selectvaluestatus == "Inuse" && computers.status == "inuse") {
          let row = createRow(computers)
          tbody.appendChild(row) 
        } else if (selectvalueroom == "Select" && selectvaluestatus == "Free" && computers.status == "free") {
          let row = createRow(computers)
          tbody.appendChild(row) 
        }
      }
    })
  }
  
  window.addEventListener('load', (event) => {
    Ready();
  }, false)
}())
