import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const ErrorPageStyle = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .lggo {
    display: inline-block;
    margin-bottom: 40px;
  }
  .heading {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .back {
    display: inline-block;
    padding: 15px 30px;
    color: white;
    background-color: ${(props) => props.theme.primary};
    border-radius: 4px;
    font-weight: 500px;
  }
`;

const ErrorPage = () => {
  return (
    <ErrorPageStyle>
      <NavLink to="/">
        <img srcSet="/logo.png 2x" alt="monkey-blogging" />
      </NavLink>
      <h1 className="heading">Oops! Page not found</h1>
      <NavLink to="/" className="back">
        Back to home
      </NavLink>
    </ErrorPageStyle>
  );
};

export default ErrorPage;
