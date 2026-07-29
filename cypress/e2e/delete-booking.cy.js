/// <reference types="cypress" />

describe('Delete Booking', () => {

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
                    "username": USERNAME,
                    "password": PASSWORD
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                token = response.body.token
            })
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

    it('should delete a booking successfully', () => {
        cy.request({
            method: 'DELETE',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
        })
    })

    it('should verify the booking was actually deleted', () => {
        cy.request({
            method: 'DELETE',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        }).then((deleteResponse) => {
            expect(deleteResponse.status).to.equal(201)
            
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
                failOnStatusCode: false,
                headers: {
                    'Accept': 'application/json'
                }
            }).then((getResponse) => {
                expect(getResponse.status).to.equal(404)
            })
        })
    })

    it('should fail to delete a booking without token', () => {
        cy.request({
            method: 'DELETE',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.equal(403)
        })
    })

    it('should fail to delete a booking with invalid token', () => {
        cy.request({
            method: 'DELETE',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=anyToken`
            }
        }).then((response) => {
            expect(response.status).to.equal(403)
        })
    })

    it('should fail to delete a non-existent booking', () => {
        cy.request({
            method: 'DELETE',
            url: `https://restful-booker.herokuapp.com/booking/99999999`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        }).then((response) => {
            expect(response.status).to.be.oneOf([404, 405])
        })
    })
})