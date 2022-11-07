import * as React from 'react'
import { Route, Routes, Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import ScreenLogin from '../pages/login'
import ScreenReport from '../pages/report'
import ScreenDashboard from '../pages/dashboard'
import './index.scss'
import { T_LocalData_W_DP } from '../redux/reducer'
import { M_LocalData } from '../redux/models'
import { SET_USER_INFO } from '../redux/constant'


class Main extends React.Component<T_LocalData_W_DP, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            isLogin: false
        }
    }

    componentDidMount(): void {
        const local = localStorage.getItem('login')
        if (local !== null) {
            const token = JSON.parse(local)
            this.props.setData(SET_USER_INFO, token)
            this.setState({ isLogin: true })
        }
    }

    rootForceRefresh = () => {
        const token = this.props.local.token;
        if (token !== null) {
            this.setState({ isLogin: true })
        } else {
            this.setState({ isLogin: false })
        }
        this.forceUpdate()
    }

    rootNavigate = (to: string) => {
        // <Navigate to={to} replace={true} />
    }

    render(): JSX.Element {
        return (
            <div className='body'>
                <Routes>
                    <Route path="/" element={
                        this.state.isLogin ?
                            <ScreenDashboard renderCallback={this.rootForceRefresh} navigate={this.rootNavigate} /> :
                            <ScreenLogin renderCallback={this.rootForceRefresh} navigate={this.rootNavigate} />
                    } />
                    <Route path="/report" element={
                        this.state.isLogin ?
                        <ScreenReport renderCallback={this.rootForceRefresh} navigate={this.rootNavigate} /> :
                        <Navigate to="/" replace/>
                    } />
                </Routes>
            </div>
        )
    }
}

const mapStateToProps = (props: T_LocalData_W_DP, ownProps: {}) => ({
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
export default connect(mapStateToProps, dispatchers)(Main)
// export default Main