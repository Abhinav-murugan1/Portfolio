import { createStartHandler } from '@tanstack/react-start/client'
import { createRouter } from './router'

const router = createRouter()

const StartHandler = createStartHandler({
  router,
})

import { hydrateRoot } from 'react-dom/client'
hydrateRoot(document, <StartHandler />)