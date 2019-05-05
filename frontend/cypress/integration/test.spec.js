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
        cy.url().should('include','/')
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