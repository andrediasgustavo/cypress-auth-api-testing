/// <reference types="cypress" />

describe('Create Booking', () => {

    let payload

    before('Load Fixtures', () => {
        cy.fixture('booking').then((data) => {
            payload = data
        })
    })

    it('should create a booking successfully', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: payload.createPayload
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('bookingid')
            expect(response.body.bookingid).to.be.a('number')
            expect(response.body.booking).to.deep.include(payload.createPayload)
        })
    })

    it('should fail to create a booking with missing mandatory fields', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: {
                "totalprice": 2000,
                "depositpaid": true
            }
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 500])
        })
    })

    it('should fail to create a booking with incorrect Content-Type', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'text/plain',
                'Accept': 'application/json'
            },
            body: '{"firstname": "Andre", "lastname": "Dias", "totalprice": 2000, "depositpaid": true, "bookingdates": {"checkin": "2026-07-25", "checkout": "2026-07-31"}}'
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 415, 500])
        })
    })

})