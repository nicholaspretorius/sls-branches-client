import React from "react";
import renderWithRouter from "../../setupTests";
import App from "./App";

describe("App", () => {
  it("renders 'Hello world!'", () => {
    const { getByText } = renderWithRouter(<App />);
    const linkElement = getByText("Hello world!");
    expect(linkElement).toBeDefined();
  });

  it("renders", () => {
    const { asFragment } = renderWithRouter(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
