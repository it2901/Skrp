/*
This file is part of SKRP.

SKRP is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SKRP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with SKRP. If not, see <https://www.gnu.org/licenses/>.
*/
import React, { Component } from 'react'
import { Table, Popup, Icon, Form } from 'semantic-ui-react'
import _ from 'lodash'
import Datetime from 'react-datetime'
import 'moment/locale/nb'

class Log extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.config = {}
    this.state = {
      data: [],
      column: null,
      direction: null,
      dateRange: false,
      formDesc: '',
      formDevIds: [],
      formAdaptIds: [],
      adaptionIds: [],
      deviceIds: [],
      adaptionTypes: [],
      formAdaptionType: '',
      formDate: '',
      formDateFrom: '',
      formDateTo: '',
      canFilter: true,
      logHeaders: [],
      liveUpdate: true,
      liveUpdater: 0
    }
    this.queryString = ''
    // a map from api keys to form names
    this.queryParams = {
      'date': 'formDate',
      'description': 'formDesc',
      'device_id': 'formDevIds',
      'adaption_id': 'formAdaptIds',
      'date_from': 'formDateFrom',
      'date_to': 'formDateTo',
      'adaption_type': 'formAdaptionType'
    }
    // used to filter out what headers to use in table
    this.wantedHeaders = [
      'created',
      'adaption_type',
      'description',
      'system_log_id',
      'device_id'
    ]
  }

  async setConfig () {
    // GETs the local config.JSON and sets it to state
    const config = await fetch('config.JSON').then(data => data.json()).catch(err => console.error(err))
    this.config = config
    this.config.updateFrequency = (config.LOG_UPDATE_FREQUENCY == 0 || config.LOG_UPDATE_FREQUENCY == undefined) ? config.GLOBAL_UPDATE_FREQUENCY : config.LOG_UPDATE_FREQUENCY
  }
  handleSort = clickedColumn => () => {
    // handles sorting on the table when clicking a header
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending'
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    })
  }
  componentDidMount () {
    // gets config and fetches data at component mount
    this.setConfig()
    // Fetch logs from rest api
    // and unwraps headers and filter options
    // the unwrapping only happens on mount
    // this.defaultFetch() is used elsewhere
    this.fetch()
      .then((e) => {
        let d = JSON.parse(e.target.response)

        //
        d.forEach(x => x.created = x.created.replace(/T|Z/g, ' '))

        let deviceIds = d
          .map(o => o.device_id)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(o => {
            return { text: o, key: o, value: o }
          })
        let adaptionTypes = d
          .map(o => o.adaption_type)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort()
          .map(o => {
            return { text: o, key: o, value: o }
          })
        let logHeaders = Object.keys(d[0])
          .filter(o => this.wantedHeaders.includes(o))
          .map(o => {
            return {
              key: o,
              text: o.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' '), // prettify? oof
              value: o
            }
          })
        this.setState({
          data: d,
          deviceIds: deviceIds,
          // adaptionIds: adaptionIds, DEPR
          adaptionTypes: adaptionTypes,
          logHeaders: logHeaders
        })
      })
  }
  defaultFetch (query) {
    // only sets data state, used on filter, reset and liveupdate
    query = query || ''
    this.fetch(query)
      .then(e => {
        // return if error
        if (!e.target.response) return
        let d = JSON.parse(e.target.response)
        // eslint sucks, but this totally works :ooo
        d.forEach(x => x.created = x.created.replace(/T|Z/, ' '))
        // sorts the data again since liveupdate ruins the sorting
        if (this.state.column) {
          d = _.sortBy(d, [this.state.column])
          d = (this.state.direction === 'descending') ? d.reverse() : d
        }
        this.setState({ data: d })
      }).catch(e => {
        // most likely 404
        this.setState({ data: [] })
      })
  }
  getRelativeUrl () {
    // gets relative url oof
    let d = document.URL
    let a = d.split('/')
    let method = a[0]
    let uri = a[2].split(':')[0]
    return `${method}//${uri}`
  }
  fetch (query) {
    // not using fetch api, because cypress can't intercept it
    query = query || ''
    // console.log(query)
    let u = this.getRelativeUrl()
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', `${u}:8090/filtersyslog${query}`)
      xhr.onload = resolve
      xhr.onerror = reject
      xhr.send()
    })
    // old code below, keep it like we don't have git OMEGALUL

    // let xhttp = new XMLHttpRequest({ mozSystem: true })
    // let self = this
    // xhttp.onreadystatechange = function () {
    //   if (this.readyState === 4 && this.status === 200) {
    //     // Setstate
    //     let d = JSON.parse(xhttp.responseText)
    //     // fuck eslint
    //     d.forEach(x => x.created = x.created.replace('T', ' ').replace('Z', ' '))
    //     self.setState({ data: d })
    //     return d
    //   } else if (this.readyState === 4 && this.status === 404) {
    //     // no results
    //     self.setState({ data: [] })
    //   }
    // }
    // xhttp.open('GET', 'http://localhost:8090/filtersyslog' + query, true)
    // xhttp.send()
  }
  filter () {
    // validate form
    let queryList = []
    let q = Object.assign({}, this.queryParams)
    let queryString = ''

    if (this.state.dateRange) {
      // remove date entry if range is selected
      delete q['date']
    } else {
      // and vice versa
      delete q['date_from']
      delete q['date_to']
    }
    // filter and add to query array
    for (let i in q) {
      let a = this.state[q[i]]
      if (a.length !== 0) {
        // not empty value
        if (i.startsWith('date')) {
          // is date string
          // format [] escapes characters
          a = a.format('YYYY-MM-DD')
        }
        queryList.push({ [i]: a })
      }
    }
    // build string
    if (queryList.length) {
      // list not empty
      queryString += '?'
      queryString += queryList.map((o) => Object.keys(o)[0] + '=' + o[Object.keys(o)[0]]).join('&')
    }
    this.queryString = queryString

    // and then fetch
    this.defaultFetch(queryString)
  }
  toggleDateRange () {
    this.setState({ dateRange: !this.state.dateRange })
    this.checkIfCanFilter()
  }
  onChange = e => this.setState({ [e.name]: e.value })

  dateToIsValid = (current) => {
    // checks if dateTo is after dateFrom

    return this.state.formDateFrom ? current.isAfter(this.state.formDateFrom) : true
  }
  onDateChange = (name, e) => {
    // returns moment obj if valid date
    if (typeof e === 'object') {
      // also check if can filter
      this.setState({ [name]: e })
      this.checkIfCanFilter()
    }
  }
  checkIfCanFilter=() => {
    // timeout cause state is fucked idk
    // ensures that the fields are empty or both are filled
    setTimeout(() => {
      this.setState({ canFilter: !(this.state.dateRange && !!(!this.state.formDateFrom ^ !this.state.formDateTo)) })
      // console.log(!(this.state.dateRange && !!(!this.state.formDateFrom ^ !this.state.formDateTo)))
    }, 1)
  }
  renderDateInput = (props, name) => {
    // custom render function for the dateTime component
    const clear = () => {
      this.setState({ [name]: '' })
      this.checkIfCanFilter()
    }

    return (
      <div style={{ position: 'relative' }}>
        { !this.state.canFilter && !this.state[name] && <Popup
          content='Either fill in both date fields, or none'
          trigger={
            <Icon color='blue' name='info circle' size="large" style={{ position: 'absolute', 'left': -30, 'top': 7 }}/>
          }

        />}
        <Form.Input {...props}
          data-cy={name}
          error={!this.state.canFilter && !this.state[name] }
          icon={
            <Icon link name={this.state[name] ? 'close' : undefined} onClick={clear} />
          }
        />
      </div>
    )
  }
  resetForm = () => {
    // resets form
    this.setState({
      formAdaptIds: [],
      formDate: '',
      formDateFrom: '',
      formDateTo: '',
      formDesc: '',
      formDevIds: [],
      formAdaptionType: '',
      canFilter: true,
      column: null,
      direction: null
    })
    // also fetch new ok
    this.queryString = ''
    this.defaultFetch()
  }
  generateDateField (fields) {
    // this is not used, as it was hard to generalize since fields had different usage
    return <Form.Field
      control={Datetime}
      label={fields.label || ''}
      dateFormat="YYYY-MM-DD"
      // timeFormat='HH:mm:ss'
      timeFormat={false}
      width={16}
      onChange={e => this.onDateChange(fields.name, e)}
      name={fields.name}
      // value={fields.value}
      // defaultValue=''
      renderInput={this.renderDateInput}
    />
  }
  liveUpdateChange () {
    // onClick handler for liveUpdate button
    let liveUpdater = this.state.liveUpdater
    if (this.state.liveUpdate) {
      liveUpdater = setInterval(() => {
        this.defaultFetch(this.queryString)
      }, 5000)
      this.setState({
        liveUpdater: liveUpdater
      })
    } else {
      clearInterval(this.state.liveUpdater)
      this.setState({
        liveUpdater: 0
      })
    }
  }

  render () {
    const { column, data, direction,
      dateRange, formDesc, formAdaptIds,
      formDevIds, formDate, formDateFrom,
      formDateTo, canFilter, adaptionIds,
      deviceIds, formAdaptionType, adaptionTypes, logHeaders } = this.state
    return (
      <div style={{
        marginLeft: '20vw',
        paddingTop: '50px',
        display: 'flex',
        flexDirection: 'row'
      }
      }>
        <Form warning={!canFilter} style={{ right: 0 }}>
          <Form.Input
            placeholder="Description"
            icon='search'
            iconPosition='left'
            name="formDesc"
            onChange={e => this.onChange(e.target)}
            value={formDesc}
          />
          <Form.Dropdown
            options={deviceIds}
            placeholder="Device ids"
            name="formDevIds"
            value={formDevIds}
            onChange={(e, data) => this.onChange(data)}
            fluid selection clearable multiple />
          {/* deprecated
          <Form.Dropdown
            options={adaptionIds}
            placeholder="Adaption ids"
            name="formAdaptIds"
            value={formAdaptIds}
            onChange={(e, data) => this.onChange(data)}
            fluid selection clearable multiple /> */}
          <Form.Dropdown
            options={adaptionTypes}
            placeholder="Adaption types"
            name="formAdaptionType"
            value={formAdaptionType}
            onChange={(e, data) => this.onChange(data)}
            fluid selection clearable search />
          <Form.Field>
            <span style={{ textAlign: 'center' }}>Date
              <Popup
                content={dateRange ? 'Filter by single date' : 'Filter by date range'}
                trigger={
                  <Icon
                    data-cy='Toggle'
                    link
                    circular
                    inverted
                    style={{ marginLeft: '5px' }}
                    name='arrows alternate horizontal'
                    onClick={() => this.toggleDateRange()}
                  />}
              />
            </span>
          </Form.Field>
          {
            dateRange
              ? <Form.Group grouped >
                <Form.Field
                  control={Datetime}
                  label={'From'}
                  dateFormat='YYYY-MM-DD'
                  // timeFormat='HH:mm:ss'
                  timeFormat={false}
                  width={16}
                  onChange={e => this.onDateChange('formDateFrom', e)}
                  name={'formDateFrom'}
                  value={formDateFrom}
                  // defaultValue=''
                  closeOnSelect
                  renderInput={(e) => this.renderDateInput(e, 'formDateFrom')}
                />
                <Form.Field
                  control={Datetime}
                  label={'To'}
                  dateFormat='YYYY-MM-DD'
                  // timeFormat='HH:mm:ss'
                  timeFormat={false}
                  width={16}
                  onChange={e => this.onDateChange('formDateTo', e)}
                  name={'formDateTo'}
                  isValidDate={this.dateToIsValid}
                  value={formDateTo}
                  closeOnSelect
                  // defaultValue=''
                  renderInput={(e) => this.renderDateInput(e, 'formDateTo')}
                />
              </Form.Group>
              : <Form.Group widths={1}>
                <Form.Field
                  control={Datetime}
                  dateFormat='YYYY-MM-DD'
                  // timeFormat='HH:mm:ss'
                  timeFormat={false}
                  width={16}
                  onChange={e => this.onDateChange('formDate', e)}
                  name='formDate'
                  value={formDate}
                  closeOnSelect
                  // defaultValue=''
                  renderInput={(e) => this.renderDateInput(e, 'formDate')}
                />
              </Form.Group>
          }
          <Form.Button
            type="submit"
            onClick={() => this.filter()}
            content="Filter"
            primary fluid
            disabled={ !canFilter }
          />
          <Form.Button
            type="reset"
            content="Reset"
            negative fluid
            onClick={this.resetForm}
          />
          <Form.Button
            style={{
              background: this.state.liveUpdate ? 'red' : 'green',
              color: 'white'
            }}
            fluid
            content={'Live Update: ' + (this.state.liveUpdate ? 'OFF' : 'ON') }
            onClick={() => {
              this.setState(prevState => ({
                liveUpdate: !prevState.liveUpdate
              }))
              this.liveUpdateChange()
            }}
          />
        </Form>
        <Table sortable celled collapsing style={{ margin: '0', marginLeft: '40px' }}>
          <Table.Header>
            <Table.Row>
              {
                logHeaders.map(o => {
                  return (
                    <Table.HeaderCell
                      key={o['value']}
                      sorted={column === o['value'] ? direction : null}
                      onClick={this.handleSort(o['value'])}
                    >
                      {o['text']}
                    </Table.HeaderCell>
                  )
                })
              }
            </Table.Row>
          </Table.Header>
          <Table.Body data-cy='children'>
            { data.map((o, index) => {
              return (
                <Table.Row key={o.toString() + index}>
                  {logHeaders.map((i) => {
                    return <Table.Cell key={o.created + i.key}> {o[i.key]} </Table.Cell>
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>

      </div >
    )
  }
}
export default Log
