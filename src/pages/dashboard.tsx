import * as React from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { API_AUTH_PWD, API_REPORT_DATA } from '../helper/constant'
import { SET_USER_INFO } from '../redux/constant'
import { M_LocalData } from '../redux/models'
import { T_LocalData_W_DP } from '../redux/reducer'
import { HashLoader } from 'react-spinners'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import './dashboard.scss'


class DashboardClass extends React.Component<T_LocalData_W_DP, any> {

    constructor(props: T_LocalData_W_DP) {
        super(props)
        this.state = {
            swal: withReactContent(Swal),
            username: this.props.local.username,
            isAlready: false,
            moveToReport: false,
            reports: [],
            todoPending: [],
            todoPostponed: [],
            password: '',
            passwordBtn: 'Ganti',
            saving: {
                password: false
            },
            loading: {
                content: true
            }
        }
        this.ReportList = this.ReportList.bind(this)
        this.TodoPendingList = this.TodoPendingList.bind(this)
        this.TodoPostponedList = this.TodoPostponedList.bind(this)
        this.ChangePass = this.ChangePass.bind(this)
    }

    componentDidMount(): void {
        async function GetInitialData(authToken: string | null) {
            const response = await fetch(API_REPORT_DATA, {
                method: 'GET',
                headers: {
                    Authorization: authToken ? authToken : ''
                }
            })
            return response.json()
        }
        const tokenAuth = this.props.local.token;
        if (tokenAuth === null) {
            this.props.renderCallback()
            return;
        }
        GetInitialData(tokenAuth).then((result: any) => {
            this.setState({
                ...this.state,
                reports: result.report,
                todoPending: result.todo.pending,
                todoPostponed: result.todo.postponed
            })
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    loading: { content: false }
                })
            }, 2500)
        }).catch((err: any) => {
            console.log(err)
        })
    }

    ReportList = () => {
        return (
            <>
                {this.state.reports.map((item: any, index: number) => {
                    return (
                        <div className='laporan' key={index} style={{cursor:'pointer'}} onClick={()=>{
                            this.state.swal.fire({
                                html:item.content
                            })
                        }} >
                            <div className='laporan-header'>
                                {item.type}
                            </div>
                            <div className='laporan-title'>
                                <div className='lap-title'>
                                    {item.title}
                                </div>
                                <div className='lap-tanggal'>
                                    {item.date} UTC
                                </div>
                            </div>
                            <div className='lap-todos'>
                                {item.todos.map((item: any, index: number) => {
                                    return (
                                        <span className='lap-todos-container'>
                                            <span className='lap-todos-status'>
                                                {item.status}
                                            </span>
                                            <span className='lap-todos-title'>
                                                {item.content}
                                            </span>
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    TodoPendingList = () => {
        return (
            <>
                {this.state.todoPending.map((item: any, index: number) => {
                    return (
                        <span className='dtodo-item'>
                            <span className='dtodo-date'>
                                <span style={{ padding: '2px' }} className='text-content'>
                                    {item.date}+UTC
                                </span>
                            </span>
                            <span className='dtodo-content'>
                                <span style={{ padding: '2px' }} className='text-content'>
                                    {item.content}
                                </span>
                            </span>
                        </span>
                    )
                })}
            </>
        )
    }

    TodoPostponedList = () => {
        return (
            <>
                {this.state.todoPostponed.map((item: any, index: number) => {
                    return (
                        <span className='dtodo-item-postponed'>
                            <span className='dtodo-date'>
                                <span style={{ padding: '2px' }} className='text-content'>
                                    {item.date}+UTC
                                </span>
                            </span>
                            <span className='dtodo-content'>
                                <span style={{ padding: '2px' }} className='text-content'>
                                    {item.content}
                                </span>
                            </span>
                        </span>
                    )
                })}
            </>
        )
    }

    ChangePass = () => {
        if (this.state.password === null) { return; }
        if (this.state.password === '') { return; }
        this.setState({
            saving: {
                ...this.state.saving,
                password: true
            }
        })
        async function ChangePassword(authToken: string | null, password: string) {
            const response = await fetch(API_AUTH_PWD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken ? authToken : ''
                },
                body: JSON.stringify({ password })
            })
            return response.json()
        }
        const tokenAuth = this.props.local.token;
        if (tokenAuth === null) {
            this.props.renderCallback()
            return;
        }
        ChangePassword(tokenAuth, this.state.password).then((result: any) => {
            this.setState({
                ...this.state,
                passwordBtn: 'Ganti lagi'
            })
            this.setState({
                ...this.state,
                password: '',
                saving: {
                    ...this.state.saving,
                    password: false
                }
            })
        }).catch((err: any) => {
            this.setState({
                ...this.state,
                password: '',
                saving: {
                    ...this.state.saving,
                    password: false
                }
            })
        })
    }

    Logout = () => {
        localStorage.removeItem('login')
        this.props.setData(SET_USER_INFO, {
            username: null,
            token: null
        })
        setTimeout(() => {
            this.props.renderCallback()
        }, 500)
    }

    LoadingComp = () => {
        return (
            <div className='dash-loads'>
                <HashLoader color='rgba(0,0,0,0.2)' />
            </div>
        )
    }

    render(): JSX.Element {
        return (
            <div className='container-dash'>
                <div className='dash-header'>
                    <span className='dash-header-title'>
                        hallo <strong>{this.state.username}</strong>!
                    </span>
                    <div className='dash-header-button'>
                        <span className='btn'>
                            <span className='bta' onClick={() => {
                                this.setState({ ...this.state, moveToReport: true })
                            }}>
                                {this.state.moveToReport && (<Navigate to="/report" replace />)}
                                Laporan Hari Ini
                            </span>
                        </span>
                        <span className='btn'>
                            <span className='bta' onClick={() => this.Logout()}>
                                Logout
                            </span>
                        </span>
                    </div>
                </div>
                <div className='dash-password'>
                    <span>Ganti Password</span>
                    <input
                        type="password"
                        placeholder='♳ password baru'
                        value={this.state.password}
                        disabled={this.state.saving.password ? true : false}
                        onChange={(val) => {
                            this.setState({
                                ...this.state,
                                password: val.target.value
                            })
                        }}
                    ></input>
                    {this.state.saving.password ?
                        <span className='btn'>
                            <span className='bta'>
                                Menyimpan...
                            </span>
                        </span> :
                        <span className='btn'>
                            <span className='bta' onClick={() => this.ChangePass()}>
                                {this.state.passwordBtn}
                            </span>
                        </span>
                    }
                </div>
                {this.state.loading.content ?
                    <>
                        <this.LoadingComp />
                        <this.LoadingComp />
                    </> :
                    <>
                        <div className='dash-todo'>
                            <h4>Todo : Pending</h4>
                            <div className='dash-todo-loop'>
                                <this.TodoPendingList />
                            </div>
                            <h4>Todo : Postponed</h4>
                            <div className='dash-todo-loop'>
                                <this.TodoPostponedList />
                            </div>
                        </div>
                        <div className='dash-laporan'>
                            <h4>laporan 30 hari terakhir</h4>
                            <this.ReportList />
                        </div>
                    </>
                }
            </div>

        )
    }
}

const mapStateToProps = (props: T_LocalData_W_DP, ownProps: { renderCallback: any, navigate: any }) => ({
    ...props,
    ...ownProps
});
const dispatchers = {
    resetData: (data: M_LocalData) => { },
    setData: (type: string, data: M_LocalData) => {
        return {
            type: type,
            payload: data
        }
    }
}
const ScreenDashboard = connect(mapStateToProps, dispatchers)(DashboardClass)
export default ScreenDashboard