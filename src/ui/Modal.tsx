import React, {
  cloneElement,
  ReactNode,
  useContext,
  useState,
  createContext,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

interface ModalContextProps {
  open: (name: string) => void;
  close: () => void;
  openName: string;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

function Modal({ children }: ModalProviderProps) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(() => name);

  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  children: ReactNode;
  opens: string;
}

function Open({ children, opens: openWindowName }: OpenProps) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Open must be used within a ModalProvider");
  }
  const { open } = context;

  return React.isValidElement(children)
    ? cloneElement(children as React.ReactElement, {
        onClick: () => open(openWindowName),
      })
    : null;
}

interface ModalProps {
  children: ReactNode;
  name?: string;
}

function Window({ children, name }: ModalProps) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Window must be used within a ModalProvider");
  }
  const { openName, close } = context;
  const ref = useOutsideClick(close);
  if (name !== openName) return null;

  return typeof document !== "undefined"
    ? createPortal(
        <Overlay>
          <StyledModal ref={ref as React.RefObject<HTMLDivElement>}>
            <Button onClick={close}>
              <HiXMark />
            </Button>
            <div>
              {React.isValidElement(children)
                ? cloneElement(children as React.ReactElement<any>, {
                    onCloseModal: close,
                  })
                : null}
            </div>
          </StyledModal>
        </Overlay>,
        document.body
      )
    : null;
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
