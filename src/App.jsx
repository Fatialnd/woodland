import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";

const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
`;

const StyledApp = styled.div`
  background-color: orange;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <H1>WoodLand</H1>
        <Button>Click Here</Button>
        <Input type="number" placeholder="guests number" />
      </StyledApp>
    </>
  );
}

export default App;
