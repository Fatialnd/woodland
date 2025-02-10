import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";

const StyledApp = styled.div`
  background-color: orange;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Heading type="h1">WoodLand</Heading>
        <Heading as="h2">WoodLand</Heading>
        <Heading as="h3">WoodLand</Heading>
        <Button>Click Here</Button>
        <Input type="number" placeholder="guests number" />
      </StyledApp>
    </>
  );
}

export default App;
