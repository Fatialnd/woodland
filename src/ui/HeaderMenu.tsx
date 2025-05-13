import Logout from "../features/authentication/Logout";
import styled from "styled-components";
import ButtonIcon from "./ButtonIcon";
import { HiOutlineUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
const StyledHeaderMenu = styled.div`
   display: flex;
   flex-direction: row;
   gap: 0.4rem;

li {
    list-style: none;
    }
`;


function HeaderMenu() {
    const navigate = useNavigate();
    return(
        <StyledHeaderMenu>
            <li>
                <ButtonIcon onClick={() => navigate("/account")}>
                    <HiOutlineUser />
                </ButtonIcon>
            </li>
            <li><Logout /></li>           
        </StyledHeaderMenu>
    )
}

export default HeaderMenu;