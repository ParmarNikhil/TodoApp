import { Component } from 'react';
import './App.css';
import './Todo.css';
import shortid from 'shortid';

class App extends Component {
  state = {
    temp: "",
    tododata: [],
    completed: [],
    whichtoshow: ""
  }

  handlechange = (event) => {
    event.preventDefault();
    if(event.target.value!==""){
    this.setState({ temp: event.target.value });
    }
  }

  addToList = () => {
    var today = new Date();
    this.setState({ tododata: [{ "id": shortid.generate(), "text": this.state.temp, "date": today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(), "iscomplete": false }, ...this.state.tododata] })
    localStorage.setItem("data", JSON.stringify(this.state.tododata));
    this.setState({ temp: "" });
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
    const today = new Date();
    let data = this.state.tododata.map((t)=>{
      if(t.id===todo.id){
        return {...todo,"id":todo.id,"iscomplete":true,"date": today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()}
      }
      else{
        return t;
      }
     
      
    })
    
    console.log(data);
    localStorage.setItem("data",JSON.stringify(data));
    this.setState({tododata:data});
    
    // this.setState({tododata:[{"iscomplete":true,...todo},...this.state.tododata]})
    // const cpdata = this.state.tododata
    // this.setState({tododata:cpdata})
  }

  render() {
    let tododata = [{}];
    if(this.state.tododata!==null){
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
    }
    
    return (
      <body>
      <div className="maincontainer">

        <header>Todo List</header>
        <div className="inputbox">
        <input type="text" onChange={this.handlechange} value={this.state.temp} placeholder="add something" />
        </div>
        <div className="buttonlist">
        <button onClick={this.addToList}>add</button>&nbsp;
        <button onClick={this.clearAll}>clear all</button>&nbsp;
        <button onClick={() => this.setState({ whichtoshow: "completed" })}>completed</button>&nbsp;
        <button onClick={() => this.setState({ whichtoshow: "active" })}>active todos</button>
        </div>
        <br></br>
        <div className="todolist">
          
          {tododata.map((todo) =>
            <div className="todoitems" key={todo.id}>Task: {todo.text} 
            <br></br>
            Time:  &nbsp; {todo.date} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <button onClick={()=>this.removeTodo(todo)}>✗</button>
          &nbsp;
            {!todo.iscomplete ?
            <button onClick={() => this.addToComplete(todo)} id="completebtn" className="cmpbtn" >✓</button>
            :null
            }  
              
            </div>
          )}
        </div><br></br>
        </div>
        </body>
    );
  }
}

export default App;
