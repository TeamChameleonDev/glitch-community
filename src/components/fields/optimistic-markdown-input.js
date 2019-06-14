import React from 'react';
import PropTypes from 'prop-types';

import useDebouncedValue from 'Hooks/use-debounced-value';

import MarkdownInput from '../inputs/markdown-input';


function useNonAggressivelyTrimmedInputs(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = React.useState(rawInput);
  
  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;
  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };
  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
};

/*

- takes in an initial state value 
- takes in a way to update the server

as users type (on change):
- we ping the server with a trimmed version of the text
- we display an untrimmed version

if the server hits an error:
- we display that error to the user
- we continue to let the user type as normal

on blur:
- we revert the input back to the last successfully saved response
- we hide the error

*/

const OptmisticMarkdownInput = ({ value, onChange, ...props }) => {
  const {
    inputValue, wrappedOnChange, optimisticError, wrappedOnBlur,
  } = useOptimistValueOnChangeAndBlur({ value, asyncUpdate: onChange });
  
  return <MarkdownInput {...props} value={inputValue} error={optimisticError} onChange={wrappedOnChange} optimisticError={optimisticError} onBlur={wrappedOnBlur} />;
};

OptmisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default OptmisticMarkdownInput;


function useOptimistValueOnChangeAndBlur({ value, asyncUpdate }) {
  const [nonAggressivelyTrimmedInputValue, onChangeWrappedWithTrimmedValue] = useNonAggressivelyTrimmedInputs(value, asyncUpdate)
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticValueAndDebounceCallsToServer(nonAggressivelyTrimmedInputValue, onChangeWrappedWithTrimmedValue);
  const [inputValue, wrappedOnChange, wrappedOnBlur] = useRevertOnBlurWhenError(optimisticValue, optimisticOnChange);

  return {
    inputValue, wrappedOnChange, wrappedOnBlur, optimisticError,
  };
}

function useRevertOnBlurWhenError(value, asyncUpdate, onBlur) {
  const [state, setState] = React.useState({ 
    status: null, 
    lastSavedResponse: value, 
    inputValue: value 
  });

  const wrappedOnChange = async (change) => {
    console.log("wrappedOnChange getting called with change:", change)
    setState({ status: "loading" });
    if (asyncUpdate) {
      try {
        const response = await asyncUpdate(change);
        console.log("got a response", response)
        if (response.status === 200) {
          console.log("saving")
          setState({ status: "loaded", lastSavedResponse: change, inputValue: change });
        } else {
          setState({ ...state, status: "error" });
        }
        
        return response // return response so other funcs can use it later if necessary
      } catch (error) {
        setState({ ...state, status: "error" });
        throw error; // rethrow error so other funcs can use it later if necessary
      }
    }
  }
  
  const wrappedOnBlur = () => {
    // if we're still waiting for a response from the server, keep running this func
    if (state.status === "loading") {
      wrappedOnBlur();
    } else {
      setState({ ...state, inputValue: state.lastSavedResponse });
      if (onBlur) { onBlur(); }
    }
  }
  
  React.useEffect(() => {
    console.log("setting inputstate from", state.inputValue, "to", value)
    setState({ ...state, inputValue: value })
  }, [value]);
  
  return [state.inputValue, wrappedOnChange, wrappedOnBlur];
}


/*
  What this does:
  - limit server calls to everytime state changes and it's been at least 500 ms
  - but shows whatever the latest is as you type even if it hasn't saved yet
  - returns an error message to be displayed to the user in case of error
*/

function useOptimisticValueAndDebounceCallsToServer(rawValueFromOnChange, setValueAsync) {
  // store what is being typed in, along with an error message
  // update undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ updateToSave: undefined, error: null });
  const debouncedUpdateToSave = useDebouncedValue(state.updateToSave, 500);
  
  React.useEffect(() => {
    const textHasUpdatedSinceSave = debouncedUpdateToSave !== undefined;
    if (textHasUpdatedSinceSave) {
      // if the updateToSave changes during the async action then ignore the result
      const setStateIfLastServerCallIsStillRelevant = (newState) => setState((prevState) => prevState.updateToSave === debouncedUpdateToSave ? newState : prevState );
      // this scope can't be async/await because it's an effect
      console.log("130??")
      setValueAsync(debouncedUpdateToSave).then(
        (response) => {
          console.log("response??", response)
          setStateIfLastServerCallIsStillRelevant({ updateToSave: undefined, error: null })
          return response
        },
        (error) => {
          console.log("errrrrrr")
          const message = error && error.response && error.response.data && error.response.data.message; // should there always be a default error here?
          setStateIfLastServerCallIsStillRelevant({ updateToSave: debouncedUpdateToSave, error: message });
        },
      );
    }
  }, [debouncedUpdateToSave]);

  const optimisticValue = state.updateToSave !== undefined ? state.updateToSave : rawValueFromOnChange;
  
  const setOptimisticValue = (newValue) => {
    setState((prevState) => ({ ...prevState, updateToSave: newValue }));
  };
  return [optimisticValue, setOptimisticValue, state.error];
};

