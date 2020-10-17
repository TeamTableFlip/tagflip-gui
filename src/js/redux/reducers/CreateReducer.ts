import produce from "immer";
import { Produced, Draft } from "immer/dist/types-external";

/**
 * Creates a reducer which is capable for handling multiple actions.
 *
 * @param initialState The initial state of the reducer.
 * @param handlers The action type handlers (functions) wrapped in an object.
 *        Example for the handlers parameter:
 *        {
 *          [actionTypes.actionTypeToBeHandled](state, action) {
 *              return action.attributeToBeReturnedByReducer;
 *          }
 *        }
 * @returns {reducer} A reducer which can handle multiple action types.
 */
export default function createReducer<State>(initialState: State, handlers) {
    return (state = initialState, action): Produced<State, Draft<State>> => {
        return produce(state, draft => {
            if (handlers.hasOwnProperty(action.type)) {
                handlers[action.type](draft, action)
                return draft;
            } else {
                return draft;
            }
        });
    }
}