import React from "react";
import renderWithRouter from "../../setupTests";
import Home from "./Home";

describe("Home", () => {
  it("renders 'Welcome'", () => {
    const { getByText } = renderWithRouter(<Home />);
    const heading = getByText("Welcome");
    expect(heading.textContent).toBe("Welcome");
  });
});
