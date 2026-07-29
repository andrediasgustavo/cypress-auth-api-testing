/// <reference types="cypress" />

describe('Auth / Create Token', () => {

    it('should generate token successfully with valid credentials', () => {
        cy.env(['USERNAME', 'PASSWORD']).then(({ USERNAME, PASSWORD }) => {
            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "username": USERNAME,
                    "password": PASSWORD
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body).to.have.property('token')
                expect(response.body.token).to.not.be.empty
                expect(response.body.token).to.be.a('string')
                expect(response.body).to.not.have.property('reason')
            })
        })
    })

    it('should fail to generate token with invalid username', () => {
        cy.env(['PASSWORD']).then(({ PASSWORD }) => {
            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "username": "invalid_username",
                    "password": PASSWORD
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body).to.have.property('reason', 'Bad credentials')
                expect(response.body).to.not.have.property('token')
            })
        })
    })

    it('should fail to generate token with invalid password', () => {
        cy.env(['USERNAME']).then(({ USERNAME }) => {
            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/auth',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "username": USERNAME,
                    "password": "invalid_password"
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body).to.have.property('reason', 'Bad credentials')
                expect(response.body).to.not.have.property('token')
            })
        })
    })

    it('should fail when sending empty payload', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('reason', 'Bad credentials')
            expect(response.body).to.not.have.property('token')
        })
    })

})