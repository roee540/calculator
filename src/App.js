import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      if (!state.currentOperand) {
        return state;
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (!state.previousOperand && !state.currentOperand) {
        return state;
      }
      if (!state.currentOperand) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (!state.previousOperand) {
        return {
          ...state,
          currentOperand: null,
          previousOperand: state.currentOperand,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        currentOperand: null,
        previousOperand: evaluate(state),
        operation: payload.operation,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (!state.currentOperand || !state.previousOperand || !state.operation) {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
        overwrite: true,
      };
    default:
      return {
        ...state,
      };
  }
}

function evaluate(state) {
  const previous = Number(state.previousOperand);
  const current = Number(state.currentOperand);
  let result = null;

  switch (state.operation) {
    case "/":
      result = previous / current;
      break;
    case "*":
      result = previous * current;
      break;
    case "+":
      result = previous + current;
      break;
    case "-":
      result = previous - current;
      break;
    default:
      return result;
  }

  return result.toString();
}

const FORMATTER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatOperand(operand) {
  if (!operand) return;
  const [integer, decimal] = operand.split(".");
  const formatedDigit = FORMATTER.format(integer);
  if (!decimal) return formatedDigit;
  return `${formatedDigit}.${decimal}`;
}

const App2 = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};

export default App2;
