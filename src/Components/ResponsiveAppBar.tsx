import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import {
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { appContext } from "../Utils/AppContext";

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleChange = (event: SelectChangeEvent) => {
    context.setCurrentCurrency(event.target.value as string);
  };

  let navigate = useNavigate();

  const context = React.useContext(appContext);

  const handleChangeListCoins = (e: SelectChangeEvent<string>) => {
    context.setCoinSelected(e.target.value);

    navigate("/coin/" + e.target.value, { replace: true });
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <CurrencyBitcoinIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            onClick={() => {
              navigate("/", { replace: true });
            }}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Roboto",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            Crypto-Grapher
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'>
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}>
              <MenuItem>
                <Link to='/'>
                  <Typography textAlign='center'>Accueil</Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to='/coin/bitcoin/'>
                  <Typography textAlign='center'>Information devise</Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to='/comparaison/'>
                  <Typography textAlign='center'>
                    Comparaison devises
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            variant='h6'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: "17px",
            }}>
            CGraph
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Box sx={{ margin: "0 1rem" }}>
              <Link to='/'>Accueil</Link>
            </Box>
            <Box sx={{ margin: "0 1rem" }}>
              <Link to='/coin/bitcoin'>Information devise</Link>
            </Box>
            <Box sx={{ margin: "0 1rem" }}>
              <Link to='/comparaison/'>Comparaison devises</Link>
            </Box>
          </Box>

          {context && context.listCoins && context.listCoins !== [] && (
            <FormControl>
              <Select
                labelId='select-coin'
                id='select-coin'
                value={context.coinSelected}
                /* label='Dev' */
                onChange={handleChangeListCoins}
                size='small'
                style={{
                  minWidth: 180,
                  /* height: 30, */
                  marginRight: 14 /* color: "white" */,
                }}>
                {context.listCoins.map((coin, key) => {
                  return (
                    <MenuItem key={`listCoins-${key}`} value={coin.id}>
                      {coin.name}
                    </MenuItem>
                  );
                })}
              </Select>{" "}
            </FormControl>
          )}
          {/* Par simplicité, le choix de la currency n'est pas possible sur les petits écrans */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={context.currentCurrency}
              /* label='Dev' */
              onChange={handleChange}
              size='small'
              style={{
                marginRight: 14 ,
              }}>
              <MenuItem value='USD'>USD</MenuItem>
              <MenuItem value='EUR'>EUR</MenuItem>
            </Select>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
