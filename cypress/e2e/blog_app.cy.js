describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    const otherUser = {
      name: "Other User",
      username: "otherUser",
      password: "otherUser",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.request("POST", "http://localhost:3003/api/users/", otherUser);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("salainen");
      cy.get("#login-button").click();

      cy.contains("blogs");
      cy.contains("mluukkai logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("invalid username or password");

      cy.get(".error")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(128, 26, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "mluukkai", password: "salainen" });
    });

    it("A blog can be created", function () {
      cy.get("#create-blog").click();

      cy.get("#title").type("Cypress test");
      cy.get("#author").type("Jonh Smith");
      cy.get("#url").type("www.cypresstest.com");

      cy.get("#create").click();

      cy.contains("Cypress test Jonh Smith");
    });

    describe("when blog exist", function () {
      beforeEach(function () {
        cy.get("#create-blog").click();

        cy.get("#title").type("Cypress test");
        cy.get("#author").type("Jonh Smith");
        cy.get("#url").type("www.cypresstest.com");
        cy.get("#create").click();
      });

      it("user can like a blog", function () {
        cy.get("#view").click();
        cy.get("#like").click();

        cy.contains("likes 1");
      });

      it("user who created a blog can delete it", function () {
        cy.get("#view").click();

        cy.get("#remove").click();
      });

      it("only user who created the blog can see button revome", function () {
        cy.get("#view").click();
        cy.contains("remove");

        cy.get("#logout").click();
        cy.login({ username: "otherUser", password: "otherUser" });
        cy.get("#view").click();
        cy.contains("remove").should("not.exist");
      });
    });

    describe("when exists more than one blog", function () {
      beforeEach(function () {
        cy.get("#create-blog").click();

        cy.get("#title").type("Cypress test");
        cy.get("#author").type("Jonh Smith");
        cy.get("#url").type("www.cypresstest.com");

        cy.get("#create").click();

        cy.wait(1000);

        cy.get("#create-blog").click();

        cy.get("#title").type("Other Blog");
        cy.get("#author").type("Jonh McQueen");
        cy.get("#url").type("www.otherblog.com");

        cy.get("#create").click();
        cy.wait(500);
      });

      it("blogs must be sorted by likes", function () {
        cy.contains("Cypress test Jonh Smith").contains("view").click();
        cy.get("#like").click();
        cy.contains("Cypress test Jonh Smith").contains("hide").click();

        cy.contains("Other Blog Jonh McQueen").contains("view").click();
        cy.get("#like").click();
        cy.wait(1000);

        cy.get("#like").click();
        cy.contains("Other Blog Jonh McQueen").contains("hide").click();

        cy.get(".blogs").eq(0).should("contain", "Other Blog Jonh McQueen");
        cy.get(".blogs").eq(0).should("contain", "Cypress test Jonh Smith");
      });
    });
  });
});
