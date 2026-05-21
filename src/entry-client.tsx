import { createStartHandler } from '@tanstack/react-start/client'
import { getRouter } from './router'

const router = getRouter()

const StartHandler = createStartHandler({
  router,
})

import { hydrateRoot } from 'react-dom/client'
hydrateRoot(document, <StartHandler />)