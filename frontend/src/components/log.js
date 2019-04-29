import React, { Component } from 'react'
import { Table, Popup, Icon, Form } from 'semantic-ui-react'
import _ from 'lodash'
import Datetime from 'react-datetime'
import 'moment/locale/nb'

let lfrq = process.env.REACT_APP_LOG_UPDATE_FREQUENCY
let gfrq = process.env.REACT_APP_GLOBAL_UPDATE_FREQUENCY
let updateFrequency = (lfrq == 0 || lfrq == undefined) ? gfrq : lfrq
console.log(updateFrequency)

class Log extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.config ={}
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
      canFilter: true
    }
    this.logHeaders = [
      { key: 'system_log_id', text: 'Log id', value: 'system_log_id' },
      { key: 'device_id', text: 'Device id', value: 'device_id' },
      { key: 'adaption_id', text: 'Adaption id', value: 'adaption_id' },
      { key: 'description', text: 'Description', value: 'description' },
      { key: 'created', text: 'Date', value: 'created' }
    ]
    this.queryParams = {
      'date': 'formDate',
      'description': 'formDesc',
      'device_id': 'formDevIds',
      'adaption_id': 'formAdaptIds',
      'date_from': 'formDateFrom',
      'date_to': 'formDateTo'
    }
  }

  async setConfig (){
    const config = await fetch('config.JSON').then(data => data.json()).catch(err => console.error(err))
    this.config = config
    this.config.updateFrequency  = (config.REACT_APP_LOG_UPDATE_FREQUENCY == 0 || config.REACT_APP_LOG_UPDATE_FREQUENCY == undefined) ? config.REACT_APP_GLOBAL_UPDATE_FREQUENCY : config.REACT_APP_LOG_UPDATE_FREQUENCY
    }
  handleSort = clickedColumn => () => {
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
    this.setConfig().then(
      this.fetch()
    )
    // Fetch logs from rest api
    // map unique id values for headers
    this.fetch()
      .then((e) => {
        let d = JSON.parse(e.target.response)
        // eslint sucks, but this totally works :ooo
        d.forEach(x => x.created = x.created.replace('T', ' ').replace('Z', ' '))

        let adaptionIds = d
          .map(o => o.adaption_id)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(o => {
            return { text: o, key: o, value: o }
          })

        let deviceIds = d
          .map(o => o.adaption_id)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(o => {
            return { text: o, key: o, value: o }
          })
        let adaptionTypes = d
          .map(o => o.adaption_type)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(o => {
            return { text: o, key: o, value: o }
          })
        this.setState({
          data: d,
          deviceIds: deviceIds,
          adaptionIds: adaptionIds,
          adaptionTypes: adaptionTypes
        })
      })
  }
  fetch (query) {
    // not using fetch api cause cypress sucks..
    query = query || ''
    // console.log(query)
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://localhost:8090/filtersyslog' + query)
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
    if (queryList.length !== 0) {
      // list not empty
      queryString += '?'
      queryString += queryList.map((o) => Object.keys(o)[0] + '=' + o[Object.keys(o)[0]]).join('&')
    }
    // console.log(queryString)

    // and then fetch
    this.fetch(queryString)
      .then(e => {
        let d = JSON.parse(e.target.response)
        // eslint sucks, but this totally works :ooo
        d.forEach(x => x.created = x.created.replace('T', ' ').replace('Z', ' '))
        this.setState({ data: d })
      })
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
    setTimeout(() => {
      this.setState({ canFilter: !(this.state.dateRange && !!(!this.state.formDateFrom ^ !this.state.formDateTo)) })
      // console.log(!(this.state.dateRange && !!(!this.state.formDateFrom ^ !this.state.formDateTo)))
    }, 1)
  }
  renderDateInput = (props, name) => {
    const clear = () => {
      // props.onChange({ target: { value: '' } })
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
      canFilter: true
    })
    // also fetch new ok
    this.fetch()
      .then(e => {
        let d = JSON.parse(e.target.response)
        // eslint sucks, but this totally works :ooo
        d.forEach(x => x.created = x.created.replace('T', ' ').replace('Z', ' '))
        this.setState({ data: d })
      })
  }
  generateDateField (fields) {
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
  renderDateInput = (props, name) => {
    const clear = () => {
      // props.onChange({ target: { value: '' } })
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
  checkIfCanFilter=() => {
    // timeout cause state is fucked idk
    setTimeout(() => {
      this.setState({ canFilter: !(this.state.dateRange && !!(!this.state.formDateFrom ^ !this.state.formDateTo)) })
      // console.log(!(this.state.dateRange && !!(!this.state.formDateFrom ^ !this.state.formDateTo)))
    }, 1)
  }
  renderDateInput = (props, name) => {
    const clear = () => {
      // props.onChange({ target: { value: '' } })
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

  render () {
    const { column, data, direction,
      dateRange, formDesc, formAdaptIds,
      formDevIds, formDate, formDateFrom,
      formDateTo, canFilter, adaptionIds,
      deviceIds, formAdaptionType, adaptionTypes } = this.state
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
          <Form.Dropdown
            options={adaptionIds}
            placeholder="Adaption ids"
            name="formAdaptIds"
            value={formAdaptIds}
            onChange={(e, data) => this.onChange(data)}
            fluid selection clearable multiple />
          <Form.Dropdown
            options={adaptionTypes}
            placeholder="Adaption types"
            name="formAdaptionType"
            value={formAdaptionType}
            onChange={(e, data) => this.onChange(data)}
            fluid selection />
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
        </Form>
        <Table sortable celled collapsing style={{ margin: '0', marginLeft: '40px' }}>
          <Table.Header>
            <Table.Row>
              {
                this.logHeaders.map(o => {
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
            {data.map(o => {
              return (
                <Table.Row key={o['created']}>
                  <Table.Cell>{o['system_log_id']}</Table.Cell>
                  <Table.Cell>{o['device_id']}</Table.Cell>
                  <Table.Cell>{o['adaption_id']}</Table.Cell>
                  <Table.Cell>{o['description']}</Table.Cell>
                  <Table.Cell>{o['created']}</Table.Cell>
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
