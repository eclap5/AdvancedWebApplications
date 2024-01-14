import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

const ButtonAppBar = () => {
  const { t, i18n } = useTranslation()
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to='/'>{t('home')}</Button>
          <Button color="inherit" component={Link} to='/about'>{t('about')}</Button>
          <Button id='fi' color='inherit' onClick={() => {changeLanguage('fi')}}>FI</Button>
          <Button id='en' color='inherit' onClick={() => {changeLanguage('en')}}>EN</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default function App() {
  return (
    <Suspense fallback='loading'>
      <ButtonAppBar />
    </Suspense>
  )
}