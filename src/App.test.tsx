import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyBudgetTracker } from "./views/MyBudgetTracker";
import App from './App';
import  AddExpenseForm  from './components/Expense/AddExpenseForm';
import { AppProvider } from './context/AppContext';
import Remaining from './components/Remaining';
import { Expense } from './types/types';
import ExpenseList from './components/Expense/ExpenseList';


describe("Creating an Expense", () => {
    test("Create expense", () => {
        render(<AppProvider>
          <MyBudgetTracker />
          </AppProvider>);

      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 5 } });
      fireEvent.click(screen.getByRole("button", {name: /save/i}));

      expect(screen.getByText("Groceries")).toBeInTheDocument();
      expect(screen.getByText("Remaining: $995")).toBeInTheDocument();
      expect(screen.getByText("Spent so far: $5")).toBeInTheDocument();
    })

    test("Creating out-of-budget expense", () => {
      render(<AppProvider>
        <MyBudgetTracker />
        </AppProvider>);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Very expensive item" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100000 } });
    fireEvent.click(screen.getByRole("button", {name: /save/i}));

    expect(screen.getByText("Very expensive item")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $-99000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $100000")).toBeInTheDocument();
    })

    test("Creating empty expense", () => {
      render(<AppProvider>
        <MyBudgetTracker />
        </AppProvider>);

    fireEvent.click(screen.getByRole("button", {name: /save/i}));

    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
    })

    test("Duplicate expenses", () => {
      render(<AppProvider>
        <MyBudgetTracker />
        </AppProvider>);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Groceries" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 5 } });
    fireEvent.click(screen.getByRole("button", {name: /save/i}));

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Groceries" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 5 } });
    fireEvent.click(screen.getByRole("button", {name: /save/i}));

    expect(screen.getAllByText("Groceries").length).toBe(2);
    expect(screen.getByText("Remaining: $990")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $10")).toBeInTheDocument();
  })
    
  }
);

describe("Deleting an Expense", () => {
  test("Delete expense", () => {
      render(<AppProvider>
        <MyBudgetTracker />
        </AppProvider>);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Groceries" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 5 } });
    fireEvent.click(screen.getByRole("button", {name: /save/i}));

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $995")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $5")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", {name: /x/i}));
    expect(screen.queryByText("groceries")).not.toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();

  })

  test("Deleting out-of-budget expense", () => {
    render(<AppProvider>
      <MyBudgetTracker />
      </AppProvider>);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Very expensive item" } });
    fireEvent.change(screen.getByLabelText("Cost"), { target: { value: 100000 } });
    fireEvent.click(screen.getByRole("button", {name: /save/i}));

    expect(screen.getByText("Very expensive item")).toBeInTheDocument();
    expect(screen.getByText("Remaining: $-99000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $100000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", {name: /x/i}));

    expect(screen.queryByText("Very expensive item")).not.toBeInTheDocument();
    expect(screen.getByText("Remaining: $1000")).toBeInTheDocument();
    expect(screen.getByText("Spent so far: $0")).toBeInTheDocument();
  })
});

describe("Budget Balance Verification", () => {
  test("Adding multiple and deleting multiple", () => {
    // budget is 1000 and "Remaining" + "Spent so far" = Budget
    render(<AppProvider>
      <MyBudgetTracker />
      </AppProvider>);

  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "item 1" } });
  fireEvent.change(screen.getByLabelText("Cost"), { target: { value: "12" } });
  fireEvent.click(screen.getByRole("button", {name: /save/i}));

  expect(screen.getByText("item 1")).toBeInTheDocument();
  expect(screen.getByText("Remaining: $988")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $12")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "item 2" } });
  fireEvent.change(screen.getByLabelText("Cost"), { target: { value: "27" } });
  fireEvent.click(screen.getByRole("button", {name: /save/i}));

  expect(screen.getByText("item 2")).toBeInTheDocument();
  expect(screen.getByText("Remaining: $961")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $39")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "item 3" } });
  fireEvent.change(screen.getByLabelText("Cost"), { target: { value: "350" } });
  fireEvent.click(screen.getByRole("button", {name: /save/i}));

  expect(screen.getByText("item 3")).toBeInTheDocument();
  expect(screen.getByText("Remaining: $611")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $389")).toBeInTheDocument();

  fireEvent.click(screen.getAllByText("x")[0])
  expect(screen.getByText("Remaining: $623")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $377")).toBeInTheDocument();

  // add and delete large expense
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "item 4" } });
  fireEvent.change(screen.getByLabelText("Cost"), { target: { value: "1000" } });
  fireEvent.click(screen.getByRole("button", {name: /save/i}));

  expect(screen.getByText("Remaining: $-377")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $1377")).toBeInTheDocument();

  fireEvent.click(screen.getAllByText("x")[2])
  expect(screen.getByText("Remaining: $623")).toBeInTheDocument();
  expect(screen.getByText("Spent so far: $377")).toBeInTheDocument();

  })
});