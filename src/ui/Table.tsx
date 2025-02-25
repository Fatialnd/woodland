import { useContext, ReactNode } from "react";
import styled from "styled-components";
import { createContext as reactCreateContext } from "react";

// Define types for context
interface TableContextType {
  columns: string;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

interface CommonRowProps {
  columns: string;
}

const CommonRow = styled.div<CommonRowProps>`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

interface TableProps {
  columns: string;
  children: ReactNode;
}

const Table = ({ columns, children }: TableProps) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
};

interface HeaderProps {
  children: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Header must be used within a Table provider");
  }

  const { columns } = context;

  return (
    <StyledHeader role="row" columns={columns} as="header">
      {children}
    </StyledHeader>
  );
};

interface RowProps {
  children: ReactNode;
}

const Row = ({ children }: RowProps) => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Row must be used within a Table provider");
  }

  const { columns } = context;

  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
};

const Body = ({ children }: { children: ReactNode }) => {
  return <StyledBody>{children}</StyledBody>;
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
function createContext<T>(defaultValue: T | undefined) {
  return reactCreateContext<T | undefined>(defaultValue);
}
