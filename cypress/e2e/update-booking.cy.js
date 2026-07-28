/// <reference types="cypress" />

describe('update booking', () => {

    let token = ''
    let bookingid = ''

    before('Login', () => {
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "firstname" : "Andre",
                "lastname" : "Dias",
                "totalprice" : 2000,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : "2026-07-25",
                    "checkout" : "2026-07-31"
                },
                "additionalneeds" : "Breakfast"
            }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.bookingid).to.be.a('number')
            expect(response.body.booking.totalprice).equal(2000)
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
            body: {
                "firstname": "Andre",
                "lastname": "Dias",
                 "totalprice": 5000,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2026-07-25",
                    "checkout": "2026-07-31"
                },
                "additionalneeds": "Breakfast"
            }
        }).then((response) => {
            expect(response.status).equal(200)
            expect(response.body.totalprice).equal(5000)
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
            body: {
                "firstname": "Andre",
                "lastname": "Dias",
                 "totalprice": 5000,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2026-07-25",
                    "checkout": "2026-07-31"
                },
                "additionalneeds": "Breakfast"
            }
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
            body: {
                "firstname": "Andre",
                "lastname": "Dias",
                 "totalprice": 5000,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2026-07-25",
                    "checkout": "2026-07-31"
                },
                "additionalneeds": "Breakfast"
            }
        })
    })

})