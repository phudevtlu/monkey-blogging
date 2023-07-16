import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FieldStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 20px;
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const Field = ({ children, className = "" }) => {
  return <FieldStyles className={className}>{children}</FieldStyles>;
};

export default Field;
Field.propTypes = {
  className: PropTypes.string,
};
