import * as React from 'react'
import { connect } from 'react-redux'
import { M_LocalData } from '../redux/models'
import { T_LocalData_W_DP } from '../redux/reducer'
import './login.scss'
import { SET_USER_INFO } from '../redux/constant'
import { API_AUTH } from '../helper/constant'
import { HashLoader } from 'react-spinners'


class ScreenLoginClass extends React.Component<T_LocalData_W_DP, any> {

    constructor(prop: any) {
        super(prop)
        this.state = {
            username: '',
            password: '',
            loading:{
                login:false
            }
        }
        this.LoginButton = this.LoginButton.bind(this)
        this.LoginScreen = this.LoginScreen.bind(this)
    }

    LoginButton = () => {
        this.setState({
            ...this.state,
            loading:{login:true}
        })
        async function loginNow(username: string, password: string) {
            if (username === '' && password === '') {
                throw Error("cant!")
            }
            const response = await fetch(API_AUTH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            if (response.status !== 200) { throw 401 }
            return response.json()
        }
        loginNow(
            this.state.username,
            this.state.password
        ).then((result: any) => {
            this.props.setData(SET_USER_INFO, {
                username: this.state.username,
                token: result.token
            })
            localStorage.setItem('login', JSON.stringify({
                username: this.state.username,
                token: result.token
            }))
            setTimeout(() => {
                this.props.renderCallback()
            }, 2500)
        }).catch((err: any) => {
            this.setState({
                ...this.state,
                loading:{login:false}
            })
        })
    }

    LoginScreen = () =>{
        return (
            <div className='container-login'>
                <div className='inner-container'>
                    <div className='containerLogin'>
                        <h2>Login</h2>
                        <input
                            value={this.state.username}
                            className='containerUsername'
                            placeholder='♨ username'
                            type='text'
                            onChange={(val: any) => {
                                const username = val.target.value.toLowerCase().replace(/[^a-z0-9]/gi, '');
                                this.setState({ ...this.state, username: username })
                            }}
                        ></input>
                        <input
                            value={this.state.password}
                            className='containerPassword'
                            placeholder='♖ password'
                            type='password'
                            onChange={(val: any) => { this.setState({ ...this.state, password: val.target.value }) }}
                        ></input>
                    </div>
                    <div className='containerLoginButton'>
                        <span className='btn'>
                            <span className='bta' onClick={() => this.LoginButton()}>
                                Masuk
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }


    LoginLoading = () =>{
        return (
            <div className='container-login'>
                <div className='inner-container'>
                    <HashLoader
                        color='rgba(0,0,0,0.2)'
                    />
                </div>
            </div>
        )
    }

    render(): JSX.Element {
        return (
            <>
            {this.state.loading.login?
                <this.LoginLoading/>:
                <this.LoginScreen/>
            }
            </>
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
const ScreenLogin = connect(mapStateToProps, dispatchers)(ScreenLoginClass)
export default ScreenLogin
// export default ScreenLoginClass