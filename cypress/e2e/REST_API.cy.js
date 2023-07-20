
describe('QA Test - REST-API', () => {

  const url = 'https://api.restful-api.dev/objects'
  //////////// GET endpoint verification ////////////
  it("GET All Records", () => {
    cy.request(
      {
        method: 'GET',
        url: url
      })
      .then((response) => {
        cy.log(JSON.stringify(response))
        expect(response.status).to.eq(200);
        expect(response.body).has.length(13);
      })
  })

  it("GET single record, id=7", () => {
    cy.request(
      {
        method: 'GET',
        url: url,
        qs: {
          id: 7 // Query param to filter entry of id=7
        }
      })
      .then((response) => {
        cy.log(JSON.stringify(response))
        expect(response.status).to.eq(200);
        expect(response.body).has.length(1);
        expect(response.body[0].id).to.eq('7');
        expect(response.body[0].name).to.eq('Apple MacBook Pro 16');
        expect(response.body[0].data.year).to.eq(2019);
        expect(response.body[0].data.price).to.eq(1849.99);
        expect(response.body[0].data['CPU model']).to.eq('Intel Core i9');
        expect(response.body[0].data['Hard disk size']).to.eq('1 TB');
      })
  })

  it("GET 3 records, id=3,5, and 10", () => {
    cy.request(
      {
        method: 'GET',
        url: url + '?id=3&id=5&id=10' // Changing the url to filter entries for id=3,5 and 10
      })
      .then((response) => {
        cy.log(JSON.stringify(response))
        cy.log(JSON.stringify(response))
        expect(response.status).to.eq(200);
        expect(response.body).has.length(3);
        //Response validation for third entry
        expect(response.body[0].id).to.eq('3');
        expect(response.body[0].name).to.eq('Apple iPhone 12 Pro Max');
        expect(response.body[0].data.color).to.eq('Cloudy White');
        expect(response.body[0].data['capacity GB']).to.eq(512);
        //Response validation for fifth entry
        expect(response.body[1].id).to.eq('5');
        expect(response.body[1].name).to.eq('Samsung Galaxy Z Fold2');
        expect(response.body[1].data.price).to.eq(689.99);
        expect(response.body[1].data.color).to.eq('Brown');
        //Response validation for tenth entry
        expect(response.body[2].id).to.eq('10');
        expect(response.body[2].name).to.eq('Apple iPad Mini 5th Gen');
        expect(response.body[2].data.Capacity).to.eq('64 GB');
        expect(response.body[2].data['Screen size']).to.eq(7.9);
      })
  })

  //////////// GET endpoint verification: Negative scenarios ////////////

  it("GET: Invalid Endpoint", () => {
    cy.request(
      {
        method: 'GET',
        url: url + '/test123',
        failOnStatusCode: false,

      })
      .then((response) => {
        cy.log(JSON.stringify(response))
        expect(response.status).to.eq(404);
        expect(response.body.error).to.contain('Oject with id=test123 was not found');
      })
  })

  //////////// POST, PUT and DELETE endpoints verification start here ////////////

  it("POST, PUT and DELETE endpoints verification", () => {

    const requestBody = {
      name: "i17 pro max",
      data: {
        year: 2023,
        color: 'Wite',
        price: 1849.99,
        'CPU model': "Intel Core i9",
        'Hard disk size': "1 TB"
      }
    }

    const requestBodyUpdate = {
      name: "i17 pro max - Updated",
      data: {
        year: 2022,
        color: 'Wite - Updated',
        price: 1000.00,
        'CPU model': "Intel Core i9 - Updated",
        'Hard disk size': "1 TB - Updated"
      }
    }

    cy.request(
      {
        method: 'POST',
        url: url,
        body: requestBody
      })
      .then((response) => {
        expect(response.status).to.eq(200) // The corect status code for POST metods should be 201, may be this can be an issue of the API
        expect(response.body.name).to.eq(requestBody.name)
        expect(response.body.data.year).to.eq(requestBody.data.year)
        expect(response.body.data.color).to.eq(requestBody.data.color)
        expect(response.body.data.price).to.eq(requestBody.data.price)
        expect(response.body.data['CPU model']).to.eq(requestBody.data['CPU model'])
        expect(response.body.data['Hard disk size']).to.eq(requestBody.data['Hard disk size'])
      })
      .then((response) => {
        const id = response.body.id
        cy.log("The ID is " + id)
        // verify the newly created record
        cy.request({
          method: 'GET',
          url: url + '/' + id
        })
          .then((response) => {
            cy.log(JSON.stringify(response))
            expect(response.status).to.eq(200)
            expect(response.body.name).to.eq(requestBody.name)
            expect(response.body.data.year).to.eq(requestBody.data.year)
            expect(response.body.data.color).to.eq(requestBody.data.color)
            expect(response.body.data.price).to.eq(requestBody.data.price)
            expect(response.body.data['CPU model']).to.eq(requestBody.data['CPU model'])
            expect(response.body.data['Hard disk size']).to.eq(requestBody.data['Hard disk size'])
          })
          .then((response) => {
            cy.log("The ID is " + id)
            // PUT Verification: Updating the newly created record
            cy.request({
              method: 'PUT',
              url: url + '/' + id,
              body: requestBodyUpdate
            }).then((response) => {
              expect(response.status).to.eq(200)
              expect(response.body.name).to.eq(requestBodyUpdate.name)
              expect(response.body.data.year).to.eq(requestBodyUpdate.data.year)
              expect(response.body.data.color).to.eq(requestBodyUpdate.data.color)
              expect(response.body.data.price).to.eq(requestBodyUpdate.data.price)
              expect(response.body.data['CPU model']).to.eq(requestBodyUpdate.data['CPU model'])
              expect(response.body.data['Hard disk size']).to.eq(requestBodyUpdate.data['Hard disk size'])
            })
              .then((response) => {
                cy.log(JSON.stringify(response))
                cy.log("The ID is " + id)
                // DELETE Verification: delete record
                cy.request({
                  method: 'DELETE',
                  url: url + '/' + id,

                }).then((response) => {
                  expect(response.status).to.eq(200) // The corect status code for DELETE metods should be 204, may be this can be an issue of the API
                })
                  .then((response) => {
                    const id = response.body.id
                    cy.log("The ID is " + id)
                    // GET Verification:Verify that the deleted record is not present
                    cy.request({
                      method: 'GET',
                      url: url + '/' + id,
                      failOnStatusCode: false
                    })
                      .then((response) => {

                        cy.log(JSON.stringify(response))
                        expect(response.status).to.eq(404)
                        expect(response.body.error).to.eq('Oject with id=undefined was not found.')
                      })
                  })
              })
          })
      })
  })

  it("POST, PUT and DELETE endpoints verification", () => {

    const requestBody = {
      name: "i17 pro max",
      data: {
        year: 2023,
        color: 'Wite',
        price: 1849.99,
        'CPU model': "Intel Core i9",
        'Hard disk size': "1 TB"
      }
    }

    const requestBodyUpdate = {
      name: "i17 pro max - Updated",
      data: {
        year: 2022,
        color: 'Wite - Updated',
        price: 1000.00,
        'CPU model': "Intel Core i9 - Updated",
        'Hard disk size': "1 TB - Updated"
      }
    }

    cy.request(
      {
        method: 'POST',
        url: url+'/Test123',
        body: requestBody,
        
        failOnStatusCode: false,
      })
      .then((response) => {
        expect(response.status).to.eq(405) // The corect status code for POST metods should be 201, may be this can be an issue of the API
        expect(response.body.error).to.eq('Method Not Allowed')
      })
    })
})