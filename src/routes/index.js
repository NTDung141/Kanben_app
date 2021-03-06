import React from "react"
import { Route, Switch } from "react-router-dom"
import UserLayout from "../layouts/UserLayout"
import HomePage from "../user/body/Home/HomePage"
import UserLogin from "../user/body/Login/UserLogin"
import UserSignUp from "../user/body/SignUp/UserSignUp"
import MyProfile from "../user/body/MyProfile/MyProfile"
import EmailVerify from "../user/body/EmailVerify/EmailVerify"
import FolderList from "../user/body/Folder/FolderList"
import FolderItem from "../user/body/Folder/FolderItem"
import AdminPage from "../user/body/Admin/AdminPage"
import Quiz from "../user/body/Quiz/Quiz"

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
            <AppRoute path="/folder" layout={UserLayout} component={FolderList} />
            <AppRoute path="/folder-detail/:id" layout={UserLayout} component={FolderItem} />
            <AppRoute path="/admin" layout={UserLayout} component={AdminPage} />
            <AppRoute path="/quiz/:id" layout={UserLayout} component={Quiz} />
        </Switch>
    )
}