import React from "react";
import renderWithRouter from "../../setupTests";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("renders the NotFound page", () => {
    const { getByText } = renderWithRouter(<NotFound />);
    const notFound = getByText("Sorry, page not found!");
    expect(notFound.textContent).toBe("Sorry, page not found!");
  });
});
