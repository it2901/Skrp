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
        this.setState({
            [name]:event.target.value
            })
        }
    }
    render(){
            let state = Object.entries(this.state)
            let parameters = state.map(s=>{
                return <Parameters changeParameterValue={this.onChangeParameterValue.bind(this,s[0] )}  parameter={s[1]} name ={s[0]}/> ;
          })
        return <Div>{parameters}</Div> 
    }
}

export default TweakInput;