import { IOmdbResponse } from "../../src/ts/models/IOmdbResponse";

const mockData: IOmdbResponse = {
  Search: [
    {
      Title: "Harry Potter 1",
      imdbID: "1",
      Type: "Movie",
      Poster: "url",
      Year: "2001",
    },
    {
      Title: "Harry Potter 2",
      imdbID: "2",
      Type: "Movie",
      Poster: "url",
      Year: "2002",
    },
    {
      Title: "Harry Potter 3",
      imdbID: "3",
      Type: "Movie",
      Poster: "url",
      Year: "2003",
    },
  ],
};

beforeEach(() => {
  cy.visit("/");
});
describe("testing movieApp", () => {
  it("should be able to test placeholder text", () => {
    cy.get("#searchText").should("have.attr", "placeholder", "Skriv titel här");
  });

  it("should be able to type", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");
  });

  it("should be able to search for movies", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");

    cy.get("#search").click();
  });

  it("should be able to get movies", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");

    cy.get("#search").click();

    cy.request("GET", "http://omdbapi.com/?apikey=416ed51a&s=Harry").as(
      "firstrequest"
    );

    cy.get("#movie-container >.movie").should("have.length", 10);
  });

  it("should be able to show error-message", () => {
    cy.get("#searchText").should("have.value", "");

    cy.get("#search").click();

    cy.get("#movie-container > p").should(
      "contain",
      "Inga sökresultat att visa"
    );
  });

  it("should be able to get mock-data", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", mockData).as("movierequests");

    cy.get("#search").click();

    cy.wait("@movierequests").its("request.url").should("contain", "Harry");
  });

  it("should be able to get movie-wrapper", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", mockData).as("movierequests");

    cy.get("#search").click();
    cy.get("#movie-container").within(() => {
      cy.get(".movie");
    });
  });

  it("should be able to get movie-wrappers count", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", mockData).as("movierequests");

    cy.get("#search").click();
    cy.get("#movie-container >.movie").should("have.length", 3);
  });

  it("should be able to get elements in movie-wrapper", () => {
    cy.get("#searchText").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", mockData).as("movierequests");

    cy.get("#search").click();

    cy.get("#movie-container> .movie").contains("<h3>", "<img>"); //fel
  });

  it("should be able to show error-message when typing 2 characters ", () => {
    cy.get("#searchText").type("Ha");
    cy.get("#searchText").should("have.value", "Ha");

    cy.get("#search").click();

    cy.get("#movie-container> p").should(
      "contain",
      "Inga sökresultat att visa"
    );
  });
});
