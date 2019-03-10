import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import fetch from 'isomorphic-fetch'

const Table = styled.table`
margin-left:100px;
border:1px solid #ccc;
border-spacing:0;
height:600px;
overflow-y:scroll;
display:block;
position:relative;
& > tr:nth-child(even) {
    background-color:#f1f1f1;
}
`
const Head = styled.th`
font-weight:bold;
padding: 8px 14px;
`
const Row = styled.tr`
background-color:#fff;
color:#333;
border-bottom:1px solid #ddd;
text-align:left;
${props => props.head && css`
    position:sticky;
    top:0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`}

& > td{
    width:100px;
    border:none;
    padding: 8px 14px;
    transition: all .3s cubic-bezier(.25,.8,.25,1);
}
`

class Log extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = { logElements: [] }
  }
  componentDidMount () {
    // Fetch logs from rest api
    // or something
    //
    this.fetchLog()
  }
  fetchLog () {
    fetch('http://localhost:8090/syslog')
      .then(res => {
        return res.json()
      }).then(data => {
        this.setState({ logElements: data })
      })
  }
  
  render () {
    return (
      <Table>
        <tbody>
        <Row head>
          <Head>system_log_id</Head>
          <Head>device_id</Head>
          <Head>adaption_id</Head>
          <Head>description</Head>
          <Head>created</Head>
        </Row>
        </tbody>

        {this.state.logElements.map(o => {
          return (
            <Row key={o['created']}>
              <td>{o['system_log_id']}</td>
              <td>{o['device_id']}</td>
              <td>{o['adaption_id']}</td>
              <td>{o['description']}</td>
              <td>{o['created']}</td>
            </Row>
          )
        })}

      </Table>
    )
  }
}
export default Log
