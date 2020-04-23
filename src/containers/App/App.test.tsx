import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders learn react link", () => {
    const { getByText } = render(<App />);
    const linkElement = getByText("Hello world!");
    expect(linkElement).toBeInTheDocument();
  });

  it("renders", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
