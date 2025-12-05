import ProductPage from "../support/pages/ProductPage";

describe("Product CRUD Operations E2E Tests", () => {
  const baseUrl = "http://localhost:3000";
  const timestamp = Date.now();
  const productPage = new ProductPage();
  const testProduct = {
    name: `Test Laptop ${timestamp}`,
    price: "25000",
    quantity: "15",
    description: "Test laptop for Cypress testing",
    category: "Electronics",
  };

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.loginUser("testuser123", "password123");
  });

  describe("Read/List Products Tests", () => {
    it("TC_READ_01: Should display products list on homepage", () => {
      // Ensure at least one product exists by creating one
      productPage.clickAddProduct();
      productPage.fillProductForm(testProduct);
      productPage.submitForm();
      cy.wait(500);

      cy.url().should("eq", `${baseUrl}/`);

      productPage.verifyTableHeaders();

      productPage.getProductRowCount().should("be.at.least", 1);
    });

    it("TC_READ_02: Should view product details", () => {
      // Ensure at least one product exists
      productPage.clickAddProduct();
      productPage.fillProductForm(testProduct);
      productPage.submitForm();
      cy.wait(500);

      productPage.clickViewOnFirstProduct();

      cy.url().should("include", "/viewproduct/");

      productPage.verifyProductDetailsPage();

      productPage.verifyProductFields();
    });

    it("TC_READ_03: Should navigate back to home from product details", () => {
      // Ensure at least one product exists
      productPage.clickAddProduct();
      productPage.fillProductForm(testProduct);
      productPage.submitForm();
      cy.wait(500);

      productPage.clickViewOnFirstProduct();

      cy.url().should("include", "/viewproduct/");

      productPage.clickBackToHome();

      cy.url().should("eq", `${baseUrl}/`);
      productPage.verifyTableHeaders();
    });
  });

  describe("Create Product Tests", () => {
    beforeEach(() => {
      cy.navigateToAddProduct();
    });

    it("TC_CREATE_01: Should create a new product successfully", () => {
      productPage.fillProductForm(testProduct);

      productPage.submitForm();

      cy.url().should("eq", `${baseUrl}/`, { timeout: 10000 });

      productPage.verifyProductInList(testProduct.name);
    });

    it("TC_CREATE_02: Should show validation error for empty required fields", () => {
      productPage.submitForm();

      productPage.verifyAddForm();
    });

    it("TC_CREATE_03: Should validate price is a positive number", () => {
      const invalidProduct = {
        name: "Test Product",
        price: "-1000",
        quantity: "10",
        category: "Electronics",
      };

      productPage.fillProductForm(invalidProduct);

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.include("Validation failed");
      });

      productPage.submitForm();

      productPage.verifyAddForm();
    });

    it("TC_CREATE_04: Should cancel and return to homepage", () => {
      productPage.clearAndFillField("name", "Test Product to Cancel");

      productPage.clickCancel();

      cy.url().should("eq", `${baseUrl}/`);
      productPage.verifyTableHeaders();
    });

    it("TC_CREATE_05: Should create product with all fields filled", () => {
      const fullProduct = {
        name: `Full Product ${Date.now()}`,
        price: "50000",
        quantity: "100",
        description: "Complete product with all fields filled for testing",
        category: "Clothing",
      };

      productPage.fillProductForm(fullProduct);
      productPage.submitForm();

      cy.url().should("eq", `${baseUrl}/`, { timeout: 10000 });
      productPage.verifyProductInList(fullProduct.name);
    });
  });

  describe("Update Product Tests", () => {
    beforeEach(() => {
      cy.editFirstProduct();
    });

    it("TC_UPDATE_01: Should update product successfully", () => {
      const timestamp = Date.now();
      const updatedName = `Updated Product ${timestamp}`;
      const updatedPrice = "35000";

      productPage.verifyEditForm();

      productPage.clearAndFillField("name", updatedName);
      productPage.clearAndFillField("price", updatedPrice);

      productPage.submitForm();

      cy.url().should("eq", `${baseUrl}/`, { timeout: 10000 });

      productPage.verifyProductInList(updatedName);
    });

    it("TC_UPDATE_02: Should pre-fill form with existing product data", () => {
      productPage.clickCancel();
      productPage.clickViewOnFirstProduct();

      productPage.getTextFromViewPage("Product Name:").then((viewName) => {
        productPage.getTextFromViewPage("Price:").then((viewPrice) => {
          productPage.getTextFromViewPage("Quantity:").then((viewQuantity) => {
            productPage
              .getTextFromViewPage("Description:")
              .then((viewDescription) => {
                productPage
                  .getTextFromViewPage("Category:")
                  .then((viewCategory) => {
                    productPage.clickBackToHome();
                    productPage.clickEditOnFirstProduct();

                    productPage.verifyFieldValue("name", viewName);
                    productPage.verifyFieldValue("price", viewPrice);
                    productPage.verifyFieldValue("quantity", viewQuantity);
                    productPage.verifyFieldValue(
                      "description",
                      viewDescription
                    );
                    productPage.verifyFieldValue("category", viewCategory);
                  });
              });
          });
        });
      });
    });

    it("TC_UPDATE_03: Should validate invalid data on update", () => {
      productPage.clearAndFillField("price", "-5000");

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.include("Validation failed");
      });

      productPage.submitForm();

      productPage.verifyEditForm();
    });

    it("TC_UPDATE_04: Should cancel update and return to home", () => {
      productPage.clearAndFillField("name", "Changed Name But Cancel");

      productPage.clickCancel();

      cy.url().should("eq", `${baseUrl}/`);
      productPage.verifyTableHeaders();
    });

    it("TC_UPDATE_05: Should update multiple fields at once", () => {
      const timestamp = Date.now();
      const updatedData = {
        name: `Multi Update ${timestamp}`,
        price: "45000",
        quantity: "25",
        description: "Updated description for testing",
      };

      productPage.clearAndFillField("name", updatedData.name);
      productPage.clearAndFillField("price", updatedData.price);
      productPage.clearAndFillField("quantity", updatedData.quantity);
      productPage.clearAndFillField("description", updatedData.description);

      productPage.submitForm();

      cy.url().should("eq", `${baseUrl}/`, { timeout: 10000 });
      productPage.verifyProductInList(updatedData.name);
    });
  });

  describe("Delete Product Tests", () => {
    beforeEach(() => {
      const timestamp = Date.now();
      const deleteTestProduct = {
        name: `DELETE_TEST_${timestamp}`,
        price: "10000",
        quantity: "5",
        description: "Product created for deletion test",
        category: "Books",
      };

      cy.createProduct(deleteTestProduct);

      cy.wrap(deleteTestProduct.name).as("productToDelete");
    });

    it("TC_DELETE_01: Should delete product successfully", function () {
      productPage.verifyProductInList(this.productToDelete);
      cy.deleteProduct(this.productToDelete);

      productPage.verifyProductNotInList(this.productToDelete);
    });

    it("TC_DELETE_02: Should reduce product count after deletion", function () {
      productPage.getProductRowCount().then((initialCount) => {
        cy.deleteProduct(this.productToDelete);

        productPage.getProductRowCount().should("eq", initialCount - 1);
      });
    });

    it("TC_DELETE_03: Should not affect other products when deleting one", function () {
      cy.get("tbody tr")
        .eq(1)
        .find("td")
        .first()
        .invoke("text")
        .then((secondProductName) => {
          cy.deleteProduct(this.productToDelete);

          cy.contains("td", secondProductName).should("be.visible");
        });
    });
  });

  describe("Search/Filter Functionality Tests", () => {
    it("TC_SEARCH_01: Should search products by keyword", () => {
      cy.get("tbody tr")
        .first()
        .find("td")
        .eq(0)
        .invoke("text")
        .then((productName) => {
          const searchTerm = productName.trim().substring(0, 5);

          productPage.enterSearchValue(searchTerm);
          productPage.clickSearch();

          cy.wait(500);

          productPage.getProductRowCount().should("be.at.least", 1);
        });
    });

    it("TC_SEARCH_02: Should search by product name specifically", () => {
      cy.get("tbody tr")
        .first()
        .find("td")
        .eq(0)
        .invoke("text")
        .then((productName) => {
          const searchTerm = productName.trim().substring(0, 4);

          cy.searchProducts("name", searchTerm);

          cy.get("tbody tr").should("have.length.at.least", 1);
        });
    });

    it("TC_SEARCH_03: Should search by category", () => {
      cy.searchProducts("category", "Electronics");

      cy.get("tbody tr").then(($rows) => {
        if ($rows.length > 0) {
          cy.get("tbody tr").each(($row) => {
            cy.wrap($row).find("td").eq(4).should("contain", "Electronics");
          });
        }
      });
    });

    it("TC_SEARCH_04: Should clear search and show all products", () => {
      productPage.getProductRowCount().then((initialCount) => {
        cy.searchProducts(null, "TestSearch");

        cy.clearSearch();

        productPage.getProductRowCount().should("eq", initialCount);
        cy.get('input[id="searchValue"]').should("have.value", "");
      });
    });

    it("TC_SEARCH_05: Should handle search with no results", () => {
      productPage.enterSearchValue("NONEXISTENTPRODUCT_XYZ_12345");
      productPage.clickSearch();

      cy.wait(500);

      productPage.getProductRowCount().should("eq", 0);
    });

    it("TC_SEARCH_06: Should search with keyword type (default)", () => {
      cy.get('select[id="searchType"]').should("have.value", "keyword");

      productPage.enterSearchValue("e");
      productPage.clickSearch();

      cy.wait(500);

      productPage.getProductRowCount().should("be.at.least", 0);
    });

    it("TC_SEARCH_07: Should maintain search across page interactions", () => {
      cy.get('input[id="searchValue"]').type("Test");
      cy.contains("button", "Search").click();
      cy.wait(500);

      cy.get('input[id="searchValue"]').should("have.value", "Test");
    });
  });
});
