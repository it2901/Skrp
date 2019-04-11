
describe("First test lol", ()=>{
    it("visits node graph", ()=>{
        cy.visit('http://localhost:3000')
        cy.get('.bm-burger-button').click()
        cy.contains('Network graph').click()
        //url change
        cy.url().should('include','/nodegraph')

    })})
    describe("Second test lol", ()=>{
        it("visits About ", ()=>{
        cy.contains('About').click()
        //url change
        cy.url().should('include','/about')
        //url change

        })})
        describe("Third test", ()=>{
            it("visits Parameters ", ()=>{
                cy.contains('Adjust parameters').click()
                cy.url().should('include','/tweakinput')
                cy.get('.bm-cross-button').click()
                /*
                let x = 0.2
                cy.get('form').find('input').each((input) =>{
                    cy.wrap(input).type(x).type('{enter}').clear()
                    if (x == 0.2){
                        x = 1;
                    }
                    else{
                        x+=1;
                    }
                })*/
        //close burger menu
        

    })
})