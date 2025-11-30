class ProductPage {
  visit() {
    cy.visit("http://localhost:3000/");
  }

  clickAddProduct() {
    cy.contains("a", "Add product").click();
  }

  fillProductForm(product) {
    if (product.name) cy.get('input[name="name"]').type(product.name);
    if (product.price) cy.get('input[name="price"]').type(product.price);
    if (product.quantity)
      cy.get('input[name="quantity"]').type(product.quantity);
    if (product.description)
      cy.get('textarea[name="description"]').type(product.description);
    if (product.category)
      cy.get('select[name="category"]').select(product.category);
  }

  clearAndFillField(fieldName, value) {
    // Support both full selector and field name
    const selector = fieldName.includes("[")
      ? fieldName
      : `input[name="${fieldName}"], textarea[name="${fieldName}"], select[name="${fieldName}"]`;
    // Wait for element to be visible before interacting
    cy.get(selector).should("be.visible").clear().type(value);
  }

  submitForm() {
    cy.contains("button", "Submit").click();
  }

  verifyAddProductPageTitle() {
    cy.contains("Register Product").should("be.visible");
  }

  verifyFormFieldsRendered() {
    cy.get('input[name="name"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter product name");

    cy.get('input[name="price"]')
      .should("be.visible")
      .and("have.attr", "type", "number")
      .and("have.attr", "placeholder", "Enter price");

    cy.get('input[name="quantity"]')
      .should("be.visible")
      .and("have.attr", "type", "number")
      .and("have.attr", "placeholder", "Enter quantity");

    cy.get('textarea[name="description"]')
      .should("be.visible")
      .and("have.attr", "placeholder", "Enter description");

    cy.get('select[name="category"]')
      .should("be.visible")
      .find("option")
      .should("have.length.at.least", 5);
  }

  verifyFormButtons() {
    cy.contains("button", "Submit")
      .should("be.visible")
      .and("have.attr", "type", "submit");

    cy.contains("a", "Cancel")
      .should("be.visible")
      .and("have.attr", "href", "/");
  }

  verifyFormLabels() {
    cy.contains("label", "Product Name").should("be.visible");
    cy.contains("label", "Price").should("be.visible");
    cy.contains("label", "Quantity").should("be.visible");
    cy.contains("label", "Description").should("be.visible");
    cy.contains("label", "Category").should("be.visible");
  }

  clickCancel() {
    cy.contains("a", "Cancel").click();
  }

  clickEditOnFirstProduct() {
    cy.get("tbody tr")
      .first()
      .within(() => {
        cy.contains("a", "Edit").click();
      });
  }

  clickViewOnFirstProduct() {
    cy.get("tbody tr")
      .first()
      .within(() => {
        cy.contains("a", "View").click();
      });
  }

  clickDeleteOnProduct(productName) {
    cy.contains("td", productName)
      .parents("tr")
      .within(() => {
        cy.contains("button", "Delete").click();
      });
  }

  verifyProductInList(productName) {
    cy.contains("td", productName).should("be.visible");
  }

  verifyProductNotInList(productName) {
    cy.contains("td", productName).should("not.exist");
  }

  verifyTableHeaders() {
    cy.contains("th", "ID").should("be.visible");
    cy.contains("th", "Product Name").should("be.visible");
    cy.contains("th", "Price").should("be.visible");
    cy.contains("th", "Quantity").should("be.visible");
    cy.contains("th", "Description").should("be.visible");
    cy.contains("th", "Category").should("be.visible");
    cy.contains("th", "Actions").should("be.visible");
  }

  verifyProductDetailsPage() {
    cy.contains("Product Details").should("be.visible");
    cy.get(".card").should("be.visible");
    cy.contains("Details of product id").should("be.visible");
  }

  verifyProductFields() {
    cy.contains("Product Name:").should("be.visible");
    cy.contains("Price:").should("be.visible");
    cy.contains("Quantity:").should("be.visible");
    cy.contains("Description:").should("be.visible");
    cy.contains("Category:").should("be.visible");
  }

  clickBackToHome() {
    cy.contains("a", "Back to Home").click();
  }

  getProductRowCount() {
    return cy.get("tbody tr").its("length");
  }

  verifyEditForm() {
    cy.url().should("include", "/editproduct/");
    cy.contains("Edit Product").should("be.visible");
  }

  verifyAddForm() {
    cy.url().should("include", "/addproduct");
    cy.contains("Register Product").should("be.visible");
  }

  selectSearchType(type) {
    cy.get('select[id="searchType"]').select(type);
  }

  enterSearchValue(value) {
    cy.get('input[id="searchValue"]').type(value);
  }

  clickSearch() {
    cy.contains("button", "Search").click();
  }

  clickClear() {
    cy.contains("button", "Clear").click();
  }

  getFieldValue(fieldName) {
    return cy.get(`[name="${fieldName}"]`).invoke("val");
  }

  verifyFieldValue(fieldName, expectedValue) {
    cy.get(`[name="${fieldName}"]`).should("have.value", expectedValue);
  }

  getTextFromViewPage(label) {
    return cy
      .contains(label)
      .parent()
      .invoke("text")
      .then((text) => {
        return text.replace(`${label}`, "").trim();
      });
  }
}

export default ProductPage;
