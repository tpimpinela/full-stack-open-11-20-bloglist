Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("user", JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createBlog", ({ title, url }) => {
  cy.get("input[value='new blog']").click();
  cy.get("input[name='title']").type(title);
  cy.get("input[name='url']").type(url);
  cy.get("input[type='submit'][value='create']").click();
});

Cypress.Commands.add("createBlogRequest", ({ title, url, likes }) => {
  cy.request({
    url: "http://localhost:3003/api/blogs",
    method: "POST",
    body: { title, url, likes },
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    },
  });
});

Cypress.Commands.add("showBlog", (index) => {
  cy.get(".blog input.toggle").eq(index).click();
});

Cypress.Commands.add("createUser", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/users", {
    username,
    name: username,
    password,
  });
});
