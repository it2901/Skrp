import React, {Component} from 'react'
import styled from 'styled-components'

const Table=styled.table`
border:1px solid #ccc;
border-spacing:0;
height:600px;
overflow-y:scroll;
display:block;
& > tr:nth-child(even) {
background-color:#f1f1f1;
}
`
const Head=styled.th`
font-weight:bold;
padding: 8px 14px;
`
const Row=styled.tr`
background-color:#fff;
color:#333;
border-bottom:1px solid #ddd;
text-align:left;
& > td{
    height:25px;
    width:100px;
    border:none;
    padding: 8px 14px;
}
`

class Log extends Component{
    constructor(props){
        super(props)
        this.props=props
        this.state={logElements:this.genDummy(25)}
    }
    componentDidMount(){
        //Fetch logs from rest api
        //or something
        //
    }
    genDummy(n){
        let ack=[],
            i=0,
            ad=['Compression','Poll','Subscribe'],
            desc=['NK sent nuke','Low bitrate','Not fiber :('];

        while(i<n){
            i++
            ack.push(
                {'id':this.randInt(0,100),
                'adaption':this.rand(ad),
                'description':this.rand(desc),
                'date':'d/m/y'
                .replace('d',this.randInt(1,31))
                .replace('m',this.randInt(1,12))
                .replace('y',this.randInt(0,3117))
                }
            )
        }
        return ack
    }
    randInt(from,to){
        return Math.floor(from+Math.random()*(to-from))
    }
    rand(list){
        return list[Math.floor(Math.random()*list.length)]
    }
    render(){
        return(
            <Table>
                <Row>
                    <Head>ID</Head>
                    <Head>Adaptation</Head>
                    <Head>Description</Head>
                    <Head>Date</Head>
                </Row>
                {this.state.logElements.map(
                    o=><Row name={o['date']}>
                    <td>{o['id']}</td>
                    <td>{o['adaption']}</td>
                    <td>{o['description']}</td>
                    <td>{o['date']}</td>
                    </Row>)}

            </Table>
        )
    }
}
export default Log;