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
            
            expect(response.body).to.deep.include({
                firstname: "Andre",
                lastname: "Dias",
                totalprice: 5000,
                depositpaid: true,
                additionalneeds: "Breakfast"
            })
            expect(response.body.bookingdates.checkin).to.equal("2026-07-25")
            expect(response.body.bookingdates.checkout).to.equal("2026-07-31")
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
            body: {
                "firstname": "Andre",
                "lastname": "Dias",
                "totalprice": 8000, 
                "depositpaid": false,
                "bookingdates": {
                    "checkin": "2026-08-01",
                    "checkout": "2026-08-10"
                },
                "additionalneeds": "Lunch"
            }
        }).then((putResponse) => {
            expect(putResponse.status).equal(200)
            
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
                headers: { 'Accept': 'application/json' }
            }).then((getResponse) => {
                expect(getResponse.status).equal(200)
                expect(getResponse.body.totalprice).equal(8000)
                expect(getResponse.body.depositpaid).equal(false)
                expect(getResponse.body.additionalneeds).equal("Lunch")
                expect(getResponse.body.bookingdates.checkin).equal("2026-08-01")
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
            body: {
                "totalprice": 5000,
                "depositpaid": true,
                "additionalneeds": "Breakfast"
            }
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
            expect(response.status).to.be.oneOf([404, 405]) 
        })
    })

    it('update booking with incorrect Content-Type', () => {
        cy.request({
            method: 'PUT',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'text/plain',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            },
            body: '{"firstname": "Andre", "lastname": "Dias", "totalprice": 5000, "depositpaid": true, "bookingdates": {"checkin": "2026-07-25", "checkout": "2026-07-31"}}'
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 415])
        })
    })

})