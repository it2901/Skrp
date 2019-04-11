describe('log test', () => {
  beforeEach(() => {
    cy.server({
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  })

  it('can visit endpoint and get data', () => {
    cy.route('http://localhost:8090/filtersyslog', [
      {
        'system_log_id': 1,
        'adaption_id': 1,
        'device_id': 1,
        'description': 'test',
        'created': '2019-04-03T22:23:04Z'
      },
      {
        'system_log_id': 1,
        'adaption_id': 1,
        'device_id': 1,
        'description': 'compress',
        'created': '2019-05-03T22:23:04Z'
      }
    ])
    cy.visit('http://localhost:3000')
    cy.get('.bm-burger-button').click()
    cy.contains('log').click()
    // url change
    cy.url().should('include', '/log')
    // close burger menu
    cy.get('.bm-cross-button').click()
    // check table length
    cy.get('[data-cy=children]').children().should('have.length', 2)
  })
  it('fetches correct for desc and device id', () => {
    cy.route('http://localhost:8090/filtersyslog?description=test&device_id=1', [
      {
        'system_log_id': 1,
        'adaption_id': 1,
        'device_id': 1,
        'description': 'test',
        'created': '2019-04-03T22:23:04Z'
      }
    ])
    cy.get('input[name=formDesc]').type('test')
    cy.get('div[name=formDevIds]').click()
    cy.get('div[name=formDevIds]').children('div').children().first().click()
    cy.contains('Filter').click()
    // check table
    cy.get('[data-cy=children]').children().should('have.length', 1)
  })
  it('handles 404 endpoint correctly', () => {
    // route to check for WRONG id
    cy.route('http://localhost:8090/filtersyslog?description=test&device_id=2', [])
    // first clear input
    cy.get('i.dropdown.icon.clear').click()
    // open list
    cy.get('div[name=formDevIds]').click()
    // add another in array
    cy.get('div[name=formDevIds]').children('div').children().first().next().click()
    // filter
    cy.contains('Filter').click()
    // table should have length 0 now
    cy.get('[data-cy=children]').children().should('have.length', 0)
  })
  it('can get get log between two dates', ()=>{
    cy.route('http://localhost:8090/filtersyslog',[])
    cy.route('http://localhost:8090/filtersyslog?date_from=2019-03-01&date_to=2019-05-02', [
      {
        'system_log_id': 1,
        'adaption_id': 1,
        'device_id': 1,
        'description': 'test',
        'created': '2019-04-03T22:23:04Z'
      },
      {
        'system_log_id': 1,
        'adaption_id': 1,
        'device_id': 1,
        'description': 'compress',
        'created': '2019-05-01T22:23:04Z'
      }
    ])
    
    //reset form
    cy.contains('Reset').click()
    //click date toggle
    cy.get('[data-cy=Toggle]').click()
    //fill in first date form
    cy.get('[data-cy=formDateFrom').children().first().type('2019-03-01')
    //second
    cy.get('[data-cy=formDateTo').children().first().type('2019-05-02')
    //submit
    cy.contains('Filter').click()
    //Should now have 2 items
    cy.get('[data-cy=children]').children().should('have.length', 2)
  })
})
