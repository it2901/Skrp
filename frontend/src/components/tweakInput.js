import React, {Component} from "react"
import Parameters from "./parameter"
import styled from "styled-components"

const Div = styled.div`
top-border: 50%;
display:flex;
flex-direction:row;
`;



class TweakInput extends Component{
    constructor(props){
        super(props)
        this.state = {
            "parameter1":1,
            "parameter2":2,
            "parameter3":3,
            "parameter4":4,
            "parameter5":5,
            "parameter6":6,
        }
        this.props=props
    }
    onChangeParameterValue = (name,event) =>{
        if (event.key === 'Enter') {
            console.log(name)
        this.setState({
            [name]:event.target.value
        })
    }

    }
    render(){
        return( <Div>
            <Parameters changeParameterValue={this.onChangeParameterValue.bind(this, "parameter1")}  parameter={this.state.parameter1} name ="parameter1"/> 
            <Parameters changeParameterValue={this.onChangeParameterValue.bind(this, "parameter2")}  parameter={this.state.parameter2} name ="parameter2"/> 
            <Parameters changeParameterValue={this.onChangeParameterValue.bind(this, "parameter3")}  parameter={this.state.parameter3} name ="parameter3"/> 
            <Parameters changeParameterValue={this.onChangeParameterValue.bind(this, "parameter4")}  parameter={this.state.parameter4} name ="parameter4"/> 
            <Parameters changeParameterValue={this.onChangeParameterValue.bind(this, "parameter5")}  parameter={this.state.parameter5} name ="parameter5"/> 
            <Parameters changeParameterValue={this.onChangeParameterValue.bind(this, "parameter6")}  parameter={this.state.parameter6} name ="parameter6"/> 
            </Div>
       
        )
    }
}

export default TweakInput;