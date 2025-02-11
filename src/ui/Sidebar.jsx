import styled from "styled-components";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  grid-row: 1 / -1;
`;

function Sidebar() {
  return <StyledSidebar>SideBar</StyledSidebar>;
}

export default Sidebar;
