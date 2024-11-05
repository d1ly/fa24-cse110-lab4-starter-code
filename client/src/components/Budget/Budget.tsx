import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
    const { budget, setBudget } = useContext(AppContext);
    
    useEffect(() => {
      loadBudget();
      }, []);
    
      // Function to load expenses and handle errors
      const loadBudget = async () => {
        try {
          const newBudget = await fetchBudget();
          setBudget(newBudget);
          } catch (err: any) {
          console.log(err.message);
        }
      };
      
      // submit handler for update budget
      const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        const newBudget: number = budget
        updateBudget(newBudget);
        setBudget(newBudget);
      };

    return (
      <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
        <div>Budget: ${budget}</div>
        <form onSubmit={(event) => onSubmit(event)}  className="d-flex align-items-center">
                <input
                    required
                    type="number"
                    className="form-control me-2"
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value) as number)}
                />
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
            </form>
      </div>
    );
};

export default Budget;
