import { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import '../assets/css/newPurchase.css'
import { LoadingCircles } from "./Loading";

export class NewPurchase extends Component{

    constructor(props){
        super(props)
        this.addCathegory=this.addCathegory.bind(this)
        this.selectCathegory=this.selectCathegory.bind(this)
        this.sendPurchase=this.sendPurchase.bind(this)
        this.state={
            cathegoryMenuIsOpen:false,
            sendButton:<input type="submit" className="send" value="send"></input>,
            options:[
                {value:"rent",label:"rent"},
                {value:"food",label:"food"},
                {value:"public services",label:"public services"}],
                cathegorySelected:{value:"noCathegory",label:"cathegory"}
        }
    }

    render(){
        console.log("Rendered new Purchase")
        return (
            <div className="newPurchase">
                <p className="newPurchaseTitle">Log a new Purchase</p>
                <form onSubmit={this.sendPurchase}>
                    <div className="fields">
                        <input className="newPrice" placeholder="$price" type="number" required></input>
                        <div className="options">
                            <input className="newName" placeholder="name" type="text"></input>
                            <Select onKeyDown={this.addCathegory} 
                            value={this.state.cathegorySelected}
                            onChange={this.selectCathegory}
                            className="newCathegory" 
                            options={this.state.options} />
                            <input className="newDate" type="date"></input>
                        </div>
                    </div>
                    <div className="sendButtonContainer">
                   {this.state.sendButton} 
                   </div>
                </form>
            </div>
            )
        }

    addCathegory(ev){
        if(ev.keyCode===13){
            let previousValue=ev.target.value
            this.setState({cathegorySelected:{value: previousValue, label: previousValue}})
            console.log(previousValue)
            ev.target.blur()
        }
    }
    async sendPurchase(ev){
        ev.preventDefault();
        this.setState({sendButton:<LoadingCircles/>})
        let cathegory=this.state.cathegorySelected.value
        cathegory=cathegory!=="noCathegory"?cathegory:"various"

        let date=ev.target[3].value
        date=date?date:new Date()

        const newPurchase={
            userId:1,
            price:ev.target[0].value,
            cathegory,
            name:ev.target[1].value,
            date
        }

        const {status}=await axios.post(process.env.REACT_APP_PURCHASES_URI, newPurchase)
        
        if(status===200){
            console.log("Data saved")
            await this.props.update()
        }
        else{console.log("Error: "+ status)}
        this.setState({sendButton:<input type="submit" className="send" value="send"></input>})
    }


    selectCathegory(ev){
        this.setState({
            cathegorySelected:{value:ev.value, label:ev.value}
        })
    }
}