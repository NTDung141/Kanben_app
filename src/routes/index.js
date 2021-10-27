import React from "react"
import { Route, Switch } from "react-router-dom"
import UserLayout from "../layouts/UserLayout"
import HomePage from "../user/body/Home/HomePage"
import UserLogin from "../user/body/Login/UserLogin"
import UserSignUp from "../user/body/SignUp/UserSignUp"
import MyProfile from "../user/body/MyProfile/MyProfile"
import EmailVerify from "../user/body/EmailVerify/EmailVerify"

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => {
    return (
        <Route {...rest} render={
            props => (
                <Layout>
                    <Component {...props} />
                </Layout>
            )
        } />
    )
}

export default () => {
    return (
        <Switch>
            <AppRoute exact path="/" layout={UserLayout} component={HomePage} />
            <AppRoute path="/login" layout={UserLayout} component={UserLogin} />
            <AppRoute path="/sign-up" layout={UserLayout} component={UserSignUp} />
            <AppRoute path="/my-profile" layout={UserLayout} component={MyProfile} />
            <AppRoute path="/email-verify/:token" layout={UserLayout} component={EmailVerify} />
        </Switch>
    )
}