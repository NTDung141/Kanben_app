import React from 'react';
import UserHeader from '../user/header/UserHeader';

function UserLayout({ children }) {
    return (
        <div>
            <UserHeader />
            {children}
        </div>
    );
}

export default UserLayout;