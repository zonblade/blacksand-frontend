type T_SaveReport = (

) => void
type T_SetTitle = (

) => void
type T_SetType = (

) => void
type T_SetReport = (

) => void
type T_BranchAdd = (

) => void
type T_BranchSet = (

) => void
type T_BranchList = (

) => JSX.Element

interface I_BranchData {
    id:string,
    content:string,
    status:string
}

export type {
    T_SaveReport,
    T_SetTitle,
    T_SetType,
    T_SetReport,
    T_BranchAdd,
    T_BranchSet,
    T_BranchList,
    I_BranchData
}