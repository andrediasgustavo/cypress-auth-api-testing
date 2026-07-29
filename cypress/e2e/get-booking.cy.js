/// <reference types="cypress" />

describe('Get Booking', () => {

    let bookingid = ''
    let payload

    before('Load Fixtures', () => {
        cy.fixture('booking').then((data) => {
            payload = data
        })
    })

    beforeEach('Create Booking', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload.createPayload
        }).then((response) => {
            expect(response.status).to.equal(200)
            bookingid = response.body.bookingid
        })
    })

    it('should get booking details successfully by id', () => {
        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.deep.include(payload.createPayload)
            expect(response.body).to.have.property('firstname')
            expect(response.body).to.have.property('lastname')
            expect(response.body).to.have.property('totalprice')
            expect(response.body).to.have.property('depositpaid')
            expect(response.body).to.have.property('bookingdates')
            expect(response.body).to.have.property('additionalneeds')
        })
    })

    it('should return 404 when trying to get a non-existent booking', () => {
        cy.request({
            method: 'GET',
            url: 'https://restful-booker.herokuapp.com/booking/99999999',
            failOnStatusCode: false,
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.equal(404)
        })
    })

    it('should return 418 when Accept header is incorrectly set', () => {
        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Accept': 'text/plain'
            }
        }).then((response) => {
            expect(response.status).to.equal(418)
        })
    })

})