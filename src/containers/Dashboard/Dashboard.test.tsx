import React from "react";
import renderWithRouter from "../../setupTests";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  it("renders the Dashboard", () => {
    const { getByText } = renderWithRouter(<Dashboard />);
    const notFound = getByText("Dashboard");
    expect(notFound.textContent).toBe("Dashboard");
  });
});
