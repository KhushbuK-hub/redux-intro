const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading:false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        balance: state.balance + action.payload.amount,
        loanPurpose: action.payload.purpose,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

export const deposit = (amount, currency) => {
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  // this return is middleware(React- redux identify that this is middleware (thunk) used which is perform async function and than will return to reducer(or store))

  return async function(dispatch,getState ){
    dispatch({type: 'account/convertingCurrency'})
    //API call
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
    const data = await res.json()
    console.log(data)
    const covertedCurrency = data.rates.USD
    //dispatch action
    dispatch({ type: "account/deposit", payload: covertedCurrency })
  }
};
export const withdraw = (amount) => {
  return { type: "account/withdraw", payload: amount };
};
export const requestLoan = (amount, purpose) => {
  return {
    type: "account/requestLoan",
    payload: { amount: amount, purpose: purpose },
  };
};
export const payLoan = () => {
  return { type: "account/payLoan" };
};
