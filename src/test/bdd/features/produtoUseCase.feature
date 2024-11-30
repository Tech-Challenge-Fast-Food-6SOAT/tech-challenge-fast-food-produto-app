Feature: BDD - ProdutoUseCase: buscarProdutoPorId

  Scenario: Product is found
    Given a product with ID "123" exists
    When I call buscarProdutoPorId with ID "123"
    Then the product with ID "123" should be returned

  Scenario: Product is not found
    Given a product with ID "123" does not exist
    When I call buscarProdutoPorId with ID "123"
    Then the response should be null
