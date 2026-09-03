import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MutualNdaForm from "./mutual-nda-form";
import { initialNda } from "../lib/nda";
import MutualNdaCreator from "./mutual-nda-creator";

describe("MutualNdaForm", () => { it("renders labels and defaults", () => { render(<MutualNdaForm data={initialNda} errors={{}} update={vi.fn()} updateParty={vi.fn()} />); expect(screen.getByLabelText("Purpose")).toHaveValue(initialNda.purpose); expect(document.getElementById("party1-name")).toBeInTheDocument(); }); it("shows validation errors", () => { render(<MutualNdaForm data={initialNda} errors={{ purpose: "Enter the purpose." }} update={vi.fn()} updateParty={vi.fn()} />); expect(screen.getByText("Enter the purpose.")).toBeInTheDocument(); expect(document.getElementById("purpose")).toHaveAttribute("aria-invalid", "true"); }); });

describe("MutualNdaCreator", () => {
  it("shows a validation summary when an export is attempted with blank party details", () => {
    render(<MutualNdaCreator />);
    fireEvent.click(screen.getByRole("button", { name: "Markdown" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Complete the highlighted fields");
  });
});
