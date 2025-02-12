import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
`;

function Header() {
  return <StyledHeader>Header</StyledHeader>;
}

export default Header;
