/// <reference types="Cypress" />
describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.createUser({ username: "root", password: "root" });
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.get("form").should("be.visible");
    cy.get("input").contains("login").should("be.visible");
    cy.contains("username", { matchCase: false });
    cy.contains("password", { matchCase: false });
  });

  describe("Login", () => {
    beforeEach(() => {
      cy.get("input[name='username']").as("usernameInput");
      cy.get("input[name='password']").as("passwordInput");
      cy.get("input[type='submit']").as("submitInput");
    });

    it("suceeds with correct credentials", () => {
      cy.get("@usernameInput").type("root");
      cy.get("@passwordInput").type("root");
      cy.get("@submitInput").click();
      cy.contains("logged in");
    });

    it("fails with wrong credentials", () => {
      cy.get("@usernameInput").type("wrong");
      cy.get("@passwordInput").type("credentials");
      cy.get("@submitInput").click();
      cy.get(".notification", { timeout: 100 })
        .as("errorNotification")
        .should("have.css", "color", "rgb(255, 0, 0)")
        .should("have.css", "border-color", "rgb(255, 0, 0)");
    });
  });

  describe.only("When logged in", () => {
    beforeEach(() => {
      cy.login({ username: "root", password: "root" });
    });

    it("A blog can be created", () => {
      cy.createBlog({ title: "Test blog", url: "www.test.com" });
      cy.contains("Test blog");
      cy.contains("www.test.com");
    });

    describe("and there are blogs created", () => {
      beforeEach(() => {
        cy.createBlogRequest({
          title: "Test blog",
          url: "www.test.com",
          likes: 5,
        });
        cy.createBlogRequest({
          title: "Test blog 2",
          url: "www.test2.com",
          likes: 10,
        });
        cy.createBlogRequest({
          title: "Test blog 3",
          url: "www.test3.com",
          likes: 105,
        });
        cy.reload();
      });

      it("A blog can be liked", () => {
        cy.showBlog(0);
        cy.get(".blog__info--likes")
          .eq(0)
          .as("blogLikes")
          .should("have.text", "105");
        cy.get("@blogLikes").find("input[type='button']").click();
        cy.get("@blogLikes").should("have.text", "106");
      });

      it("Owner can delete a blog", () => {
        cy.showBlog(0);
        cy.get(".blog input[type='button'][value='remove']").eq(0).click();
        cy.wait(100);
        cy.get(".blog").eq(0).should("include.text", "Test blog 2");
      });

      it("Not owners can't delete a blog", () => {
        cy.createUser({ username: "not_owner", password: "not_owner" });
        cy.login({ username: "not_owner", password: "not_owner" });
        cy.showBlog(0);
        cy.get("input[value='remove']").should("not.exist");
      });

      it("Blogs are ordered by their likes", () => {
        cy.get(".blog")
          .as("blogs")
          .each((element, index) => cy.showBlog(index));
        cy.get("@blogs")
          .find(".blog__info--likes")
          .then((blogLikes) => {
            const likesArr = blogLikes.map(
              (index, element) => element.innerText
            );
            cy.wrap(likesArr).should("be.equal", likesArr.sort());
          });
      });
    });
  });
});
