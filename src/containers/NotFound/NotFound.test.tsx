import React from "react";
import renderWithRouter from "../../setupTests";
import NotFound from "./NotFound";

describe("Header", () => {
  it("renders the Navbar", () => {
    const { getByText } = renderWithRouter(<NotFound />);
    const notFound = getByText("Sorry, page not found!");
    expect(notFound.textContent).toBe("Sorry, page not found!");
  });
});
