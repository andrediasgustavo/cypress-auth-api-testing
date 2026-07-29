/// <reference types="cypress" />

describe('update booking', () => {

    let token = ''
    let bookingid = ''
    let payload

    before('Load Fixtures and Login', () => {
        cy.fixture('booking').then((data) => {
            payload = data
        })

        cy.env(['USERNAME', 'PASSWORD']).then(({ USERNAME, PASSWORD }) => {
            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/auth',
                body: {
                    "username" : USERNAME,
                    "password" : PASSWORD
                }
            }).then((response) => {
                expect(response.status).equal(200)
                token = response.body.token
            })
        })   
    })

    beforeEach('Create Booking', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            headers: { 'Content-Type': 'application/json' },
            body: payload.createPayload
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.bookingid).to.be.a('number')
            bookingid = response.body.bookingid
        })
    })

    it('update booking', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: payload.updatePayload 
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalprice).equal(5000)
        })
    })

    it('update booking and verify persistence', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: payload.updatePayload
        }).then((putResponse) => {
            expect(putResponse.status).equal(200)
            
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
                headers: { 'Accept': 'application/json' }
            }).then((getResponse) => {
                expect(getResponse.status).equal(200)
                expect(getResponse.body.totalprice).equal(5000)
            })
        })
    })

    it('update booking without token', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: payload.updatePayload
        }).then((response) => {
            expect(response.status).equal(403)
        })
    })

    it('update booking with invalid token', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=anyToken`
            },
            body: payload.updatePayload
        }).then((response) => {
            expect(response.status).equal(403)
        })
    })

    it('update booking with missing mandatory fields', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: { "totalprice": 5000, "depositpaid": true }
        }).then((response) => {
            expect(response.status).equal(400)
        })
    })

    it('update booking with non-existent ID', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/99999999`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: payload.updatePayload
        }).then((response) => {
            expect(response.status).to.be.oneOf([404, 405]) 
        })
    })
})