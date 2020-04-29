import React from "react";
import renderWithRouter from "../../setupTests";
import App from "./App";

describe("App", () => {
  it("renders 'Hello world!'", () => {
    const { getByText } = renderWithRouter(<App />);
    const heading = getByText("Welcome");
    expect(heading.textContent).toBe("Welcome");
  });

  // it("renders", () => {
  //   const { asFragment } = renderWithRouter(<App />);
  //   expect(asFragment()).toMatchSnapshot();
  // });
});
