Feature: BDD - ProdutoController: buscarProdutoPorId

  Scenario: ID is missing
    Given the request does not have an ID
    When I call buscarProdutoPorId
    Then the response status code should be 400
    And the response data should be "ID do produto é obrigatório!"

  Scenario: Product is not found
    Given the request has an ID "123"
    And the product is not found
    When I call buscarProdutoPorId
    Then the response status code should be 404
    And the response data should be "Produto não encontrado"

  Scenario: Product is found
    Given the request has an ID "123456"
    And the product is found
    When I call buscarProdutoPorId
    Then the response status code should be 200
    And the response data should be the product
