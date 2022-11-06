import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import { M_LocalData } from './models';
import { DEL_USER_INFO, SET_USER_INFO } from './constant';
import * as actions from './action';
import { Navigator } from 'react-router-dom';

export type LocalDataAction = ActionType<typeof actions>;

export type T_LocalData = {
    local: M_LocalData
}

export type T_LocalData_W_DP = {
    local: M_LocalData,
    renderCallback:any,
    navigate:Navigator,
    resetData:(type:string,payload:M_LocalData)=>typeof actions.resetData,
    setData:(type:string,payload:M_LocalData)=>typeof actions.setData
}

const LocalDatasInitial: T_LocalData = {
    local: {
        token: null,
        username: null
    }
}

export default combineReducers<T_LocalData, LocalDataAction>({
    local: (state = LocalDatasInitial.local, action) => {
        switch (action.type) {
            case DEL_USER_INFO:
                return {
                    token: null,
                    username: null
                };

            case SET_USER_INFO:
                return {
                    token : action.payload.token,
                    username : action.payload.username
                };

            default:
                return state;
        }
    }
})