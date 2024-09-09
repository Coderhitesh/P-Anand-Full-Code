import React from 'react';

const PageNotFound = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <img
                    src="https://i.postimg.cc/rFb1Y9bZ/error.png"
                    alt="Page Not Found"
                    className="img-fluid mb-4"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
                <h1 className="display-4">Oops! Page Not Found</h1>
                <p className="lead">We can't seem to find the page you're looking for.</p>
                <a href="/" className="theme-btn btn-primary">Go Home</a>
            </div>
        </div>
    );
}

export default PageNotFound;
