import { Component } from 'react';
import './App.css';
// import '/TodoDarkMode.css';
import './TodoDarkMode.css';
import shortid from 'shortid';


class App extends Component {
  state = {
    temp: "",
    tododata: [],
    whichtoshow: ""
  }
  
  handlechange = (event) => {
    if(event.target.value!==""){
      this.setState({ temp: event.target.value });
    }
    
  }
  formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 ;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2,'0');
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  } 
  
  addToList = () => {
    const date = new Date();
    var today = this.formatTime(date);

    if(this.state.temp!==""){
      this.setState({ 
        tododata: [{ "id": shortid.generate(), 
        "text": this.state.temp, 
        "date": date.getDate() + ' - ' + date.toLocaleString('default',{month:'long'}) + ' - ' + today, 
        "iscomplete": false },...this.state.tododata],temp:""
      },() => {
        localStorage.setItem("data",JSON.stringify(this.state.tododata));
        
      }
      );  
    }
    
    document.getElementById("userinput").value="";
    
  }

  componentDidMount(){
    if(localStorage.getItem("data")!==null){
      this.setState({tododata:JSON.parse(localStorage.getItem("data"))})
    }
  }

  removeTodo = (todo) => {
    const cpdata = this.state.tododata;
    cpdata.splice(cpdata.indexOf(todo),1);
    this.setState({tododata:cpdata});
    localStorage.setItem("data", JSON.stringify(this.state.tododata));
  }

  clearAll = () => {
    this.setState({ tododata: [] });
    localStorage.clear("data");
  }  
  
  addToComplete = (todo) => {
    const date = new Date();
    var today = this.formatTime(date);

    let data = this.state.tododata.map((t)=>{
      if(t.id===todo.id){
        return {...todo,"id":todo.id,"iscomplete":true, "date":todo.date ,"completeddate": date.getDate() + ' - ' + date.toLocaleString('default',{month:'long'}) + ' - ' + today}
      }
      else{
        return t;
      }

    })
    
    console.log(data);
    localStorage.setItem("data",JSON.stringify(data));
    this.setState({tododata:data});
    
  }

  render() {
    let tododata = [{}];
    
      if (this.state.whichtoshow === "completed") {
        tododata = this.state.tododata.filter((
          todo => todo.iscomplete
        ))
      }
      else if(this.state.whichtoshow==="active") {
        tododata = this.state.tododata.filter((          
          todo => !todo.iscomplete
        ))
      }
      else{
        tododata = this.state.tododata;
      }
   
    return (
      <body>
      <div className="maincontainer">
        
        <header>Todo List</header>
        <div className="inputbox">
        <input type="text" id="userinput" onChange={this.handlechange} placeholder="add something" />
        
        </div> 
        <div className="buttonlist">
        <button onClick={this.addToList}>add</button>&nbsp;
        <button onClick={this.clearAll}>clear all</button>&nbsp;
        <button onClick={() => this.setState({ whichtoshow: "completed" })}>completed</button>&nbsp;
        <button onClick={() => this.setState({ whichtoshow: "active" })}>active</button>
        </div>
        <br></br>
        <center> Tasks left : {this.state.tododata.filter((todo)=>!todo.iscomplete).length} </center>
        <br></br>
        <div className="todolist"> 
          {tododata.map((todo) =>
            
            <div className="todoitems" key={todo.id}>
            Task: {todo.text}
            <br></br>
            
            Added Time:&nbsp;{todo.date}
            <br></br>
            
            {todo.iscomplete ?
            <div>
            Completed Time:&nbsp;{todo.completeddate}</div>:null  
            }

            <div style={{display:'flex', flexDirection:"column", margin:'auto'}}></div>
            
            <div className="todobtndiv">
            <button style={{width:30, height:30, fontSize:15}} onClick={()=>this.removeTodo(todo)}>✗</button>
            &nbsp;&nbsp;
            {!todo.iscomplete ?
            
            <button onClick={() => this.addToComplete(todo)} id="completebtn" style={{width:30, height:30, fontSize:15}} className="cmpbtn" >✓</button>
            :null
            }  
            </div>
            
            
            </div>
          )}
          <br></br>
             
        </div>
       
        <br></br>
        </div>
        </body>
    );
  }
}

export default App;
