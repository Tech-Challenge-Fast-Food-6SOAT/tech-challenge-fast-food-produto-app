Feature: BDD - apiRoutes: /produtos/produto/:id

  Scenario: Product is found
    Given a product with ID "123" exists
    When I call GET /produtos/produto/123
    Then the response status code should be "200"
    And the response data should contain the product with ID "123"

  Scenario: Product is not found
    Given a product with ID "123" does not exist
    When I call GET /produtos/produto/123
    Then the response status code should be "404"
    And the response data should be "Produto não encontrado"

  Scenario: Product ID is not provided
    Given the request does not have an ID
    When I call GET /produtos/produto/
    Then the response status code should be "400"
    And the response data should be "ID do produto é obrigatório!"
