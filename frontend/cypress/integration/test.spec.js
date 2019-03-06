
describe("First test lol", ()=>{
    it("visits node graph", ()=>{
        cy.visit('http://localhost:3000')
        cy.get('.bm-burger-button').click()
        cy.get('a[href="#/nodegraph"]').click()
        //url change
        cy.url().should('include','/nodegraph')

        cy.get('a[href="#/about"]').click()
        //url change
        cy.url().should('include','/about')
        //close burger menu
        cy.get('.bm-cross-button').click()

    })
})