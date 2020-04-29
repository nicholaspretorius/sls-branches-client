import React from "react";
import renderWithRouter from "../../setupTests";
import Header from "./Header";

describe("Header", () => {
  it("renders the Navbar", () => {
    const { getByText } = renderWithRouter(<Header title="Branchly" />);
    const title = getByText("Branchly");
    expect(title.textContent).toBe("Branchly");
  });
});
