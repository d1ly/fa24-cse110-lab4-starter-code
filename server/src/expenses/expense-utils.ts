import { Expense } from "../types";
import { Database } from "sqlite";
import { Request, Response } from "express";

export async function createExpenseServer(req: Request, res: Response, db: Database) {

    try {
        // Type casting the request body to the expected format.
        const { id, cost, description } = req.body as { id: string, cost: number, description: string };
 
        if (!description || !id || !cost) {
            return res.status(400).send({ error: "Missing required fields" });
        }
 
        await db.run('INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);', [id, description, cost]);
        res.status(201).send({ id, description, cost });
 
    } catch (error) {
 
        return res.status(400).send({ error: `Expense could not be created, + ${error}` });
    };
 
 }
 

export async function deleteExpense(req: Request, res: Response, db: Database) {
    const { id } = req.params;
    try {
        const expense = await db.get("SELECT * FROM expenses WHERE id = ?", [id]);
        if (!expense) {
            return res.status(404).send({ error: "Expense not found" });
        }

        await db.run("DELETE FROM expenses WHERE id = ?", [id]);

        res.status(200).send({ message: "Expense successfully deleted", deletedExpense: expense });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).send({ error: `Failed to delete expense + ${error}` });
    };
}

export async function getExpenses(req: Request, res: Response, db: Database) {
    try {
        const rows = await db.all("SELECT * FROM expenses", []);
        return res.status(200).send({ data: rows });
    } catch (err) {
        console.error("Error retrieving expenses:", err);
        return res.status(500).send({ error: `Failed to retrieve expenses: ${err}` });
    }
}