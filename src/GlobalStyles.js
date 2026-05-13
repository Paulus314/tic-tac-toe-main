import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #87d085;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .status {
    margin-bottom: 30px;
    font-size: 20px;
    text-align: center;
  }
  .moves {
    text-align: center;
  }
  ol {
    list-style: none;
    padding-left: 0;
    margin-top: 30px;
}
`;

export default GlobalStyles;