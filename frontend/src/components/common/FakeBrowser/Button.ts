import styled from 'styled-components';

const StyledButton = styled.button(
  () => ({
    marginLeft: 5,
    marginRight: 5,
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'default',
    width: 24,
    height: 24,
    borderRadius: 12,
    outline: 'none',
  })
);

export default StyledButton;
