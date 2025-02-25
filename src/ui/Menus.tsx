import React from "react";
import styled from "styled-components";
import { ReactNode, useContext, useState, useRef } from "react";
import { createContext } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { IconType } from "react-icons";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface PositionProps {
  position: {
    x: number;
    y: number;
  };
}

const StyledList = styled.ul<PositionProps>`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusContextType {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: { x: number; y: number } | null;
  setPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

interface MenusProps {
  children: ReactNode;
}

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState<string>("");
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const close = () => setOpenId("");
  const open = (id: string) => setOpenId(id);
  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

interface ToggleProps {
  id: number;
}

function Toggle({ id }: ToggleProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Toggle must be used within a Menus component");

  const { openId, close, open, setPosition } = context;
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = (e.target as HTMLElement)
      .closest("button")
      ?.getBoundingClientRect();
    openId !== id.toString() ? open(id.toString()) : close();
    setPosition({
      x: rect ? window.innerWidth - rect.width - rect.x : 0,
      y: rect ? rect.y + rect.height + 8 : 0,
    });
  }
  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  id: number;
  children: ReactNode;
}

function List({ id, children }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("List must be used within a Menus component");

  const { openId, position: listPosition, close } = context;
  if (openId !== id.toString()) return null;
  const ref = useOutsideClick<HTMLUListElement>(close);

  return listPosition
    ? createPortal(
        <StyledList position={listPosition} ref={ref}>
          {children}
        </StyledList>,
        document.body
      )
    : null;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon: IconType;
}

function Button({ children, onClick, icon }: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Button must be used within a Menus component");
  const { close } = context;

  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon && React.createElement(icon)}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
