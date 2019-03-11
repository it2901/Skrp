
describe("First test lol", ()=>{
    it("visits node graph", ()=>{
        cy.visit('http://localhost:3000')
        cy.get('.bm-burger-button').click()
        cy.contains('Network graph').click()
        //url change
        cy.url().should('include','/nodegraph')

        cy.contains('About').click()
        //url change
        cy.url().should('include','/about')
        //close burger menu
        cy.get('.bm-cross-button').click()

    })
})