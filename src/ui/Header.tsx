import styled from "styled-components";
import Logout from "../features/authentication/Logout";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
`;

function Header(): JSX.Element {
  return (
    <>
      <StyledHeader>
        <Logout />
      </StyledHeader>
    </>
  );
}

export default Header;
