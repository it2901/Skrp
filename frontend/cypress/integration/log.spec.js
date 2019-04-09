describe("log test", ()=>{
    beforeEach(()=>{
        cy.server({
            headers:{
                'Access-Control-Allow-Origin':'*'
            }
        })
    })

    it("visits log and gets data", ()=>{
        cy.route('http://localhost:8090/syslog',[
            {
                'system_log_id':1,
                'adaption_id':1,
                'device_id':1,
                'description':'test',
                'created':'2019-04-03T22:23:04Z'
            },
            {
                'system_log_id':1,
                'adaption_id':1,
                'device_id':1,
                'description':'compress',
                'created':'2019-05-03T22:23:04Z'
            }
        ])
        cy.visit('http://localhost:3000')
        cy.get('.bm-burger-button').click()
        cy.contains('log').click()
        //url change
        cy.url().should('include','/log')
        //close burger menu
        cy.get('.bm-cross-button').click()
        //check table length
        cy.get('[data-cy=children]').children().should('have.length',2)
    })
    it("fetches correct for desc and device id", ()=>{
        cy.route('http://localhost:8090/syslog?desc=test&deviceids=1',[
            {
                'system_log_id':1,
                'adaption_id':1,
                'device_id':1,
                'description':'test',
                'created':'2019-04-03T22:23:04Z'
            }
        ])
        cy.get('input[name=formDesc]').type('test')
        cy.get('div[name=formDevIds]').click()
        cy.get('div[name=formDevIds]').children('div').children().first().click()
        cy.contains('Filter').click()
        //check table
        cy.get('[data-cy=children]').children().should('have.length',1)
    })
    it("fetches no data", ()=>{

        //route to check for WRONG id
        cy.route('http://localhost:8090/syslog?desc=test&deviceids=2',[])
        //first clear input
        cy.get('i.dropdown.icon.clear').click()
        //open list
        cy.get('div[name=formDevIds]').click()
        //add another in array
        cy.get('div[name=formDevIds]').children('div').children().first().next().click()
        //filter
        cy.contains('Filter').click()
        //table should have length 0 now
        cy.get('[data-cy=children]').children().should('have.length',0)

    })
})