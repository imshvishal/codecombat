import { createTheme } from '@mui/material';
import { DashboardLayout } from '@toolpad/core';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Code } from '@mui/icons-material';
import { useMemo, useState } from 'react';

const NAVIGATIONS = [
  {kind: "header", title: "Main Menu"},
  {kind:"divider"},
  { title: "Home", segment: "/home"},
  { title: "Contests",  segment: "/contests"},
]

function App() {
  const theme = createTheme({
    colorSchemes: {light: true, dark: true},
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
  });
  const [pathname, setPathname] = useState('/home');

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        console.log(path);
        
        return setPathname(path);
      },
    };
  }, [pathname]);
  return (
    <AppProvider theme={theme} branding={{title: 'Code Combat', logo: <Code />}} navigation={NAVIGATIONS} router={router}>
      <DashboardLayout theme={theme} >

      </DashboardLayout>
    </AppProvider>
  );
}

export default App;
