import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Expense } from "../../types/types";
import { createExpense } from "../../utils/expense-utils";

const AddExpenseForm = () => {
  // Exercise: Consume the AppContext here

  const { expenses, setExpenses } = useContext(AppContext);

  // Create state variables for name and cost

  // Exercise: Create name and cost to state variables

  const [name, setName] = useState<string>("");
  const [cost, setCost] = useState<number>(0);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Exercise: Add add new expense to expenses context array
    let newId = "0";
    if (expenses.length !== 0) {
      newId = (parseInt(expenses[expenses.length - 1].id) + 1).toString()
    } 
    const newExpense: Expense = {id: newId, description: name, cost: cost}
    createExpense(newExpense);

    setExpenses([...expenses, newExpense]);
    setName("");
    setCost(0);
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          ></input>
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="number"
            min = "0" //prevent negative numbers
            className="form-control"
            id="cost"
            value={cost}
            onChange={(event) => setCost(Number(event.target.value) as number)}
          ></input>
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;
