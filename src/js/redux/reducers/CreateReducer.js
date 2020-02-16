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
export default function createReducer(initialState, handlers)
{
    return (state = initialState, action) =>
    {
        if (handlers.hasOwnProperty(action.type))
        {
            return handlers[action.type](state, action);
        }
        return state;
    }
}