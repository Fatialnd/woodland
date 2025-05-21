import styled from 'styled-components';
import { useDarkMode } from '../context/DarkModeContext';

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 20.5rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const logoSrc = isDarkMode ? '/logo-dark.png' : '/logo-light.png';
  return (
    <StyledLogo>
      <Img src={logoSrc} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
