import cy from 'cypress'

describe("First test lol"), ()=>{
    it("visits site", ()=>{
        cy.visit('https://localhost:3000')
        cy.contains('type')
    })
}