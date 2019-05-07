describe('parameter test', () => {
  beforeEach(() => {
    cy.server({
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  })

  it('can update info', () => {
    cy.route('http://localhost:8090/configure', { 'config_id': 560, 'device_id': 1, 'config': { 'willMessage': 'Finito', 'keepAlivePeriod': '123', 'cleanSession': 'false', 'brokerTcpPort': '20013', 'willFlag': 'false', 'forwarderTimeout': '123', 'checkingPeriod': '800000', 'clientInterfaces': '<org.eclipse.paho.mqttsn.gateway.client.udp.UDPClientInterface>', 'advPeriod': '123', 'willTopic': 'topics', 'serialPortURL': 'serial@COM1:57600', 'minMqttsLength': '1', 'protocolVersion': '2', 'retain': 'true', 'willQoS': '12', 'predfTopicIdSize': '2', 'brokerURL': 'api:8090', 'handlerTimeout': '800000', 'predefinedTopicsFile': 'config/predefinedTopics.properties', 'maxRetries': '5', 'gwId': '54', 'udpPort': '8090', 'protocolName': 'OSLR', 'waitingTime': '1000', 'maxMqttsLength': '10000' }, 'created': '2019-05-07T12:52:36Z' })
    cy.visit('http://localhost:3000')
    cy.get('.bm-burger-button').click()
    cy.contains('Adjust parameters').click()
    cy.url().should('include', '/tweakinput')
    cy.get('.bm-cross-button').click()
    let x = 0.2
    cy.get('form').find('input').each((input) => {
      cy.wrap(input).type(x).type('{enter}').clear()
      if (x == 0.2) {
        x = 1
      } else {
        x += 1
      }
    })
  })
})
